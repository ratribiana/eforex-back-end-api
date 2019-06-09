'use strict'
import config from '../../../config'

import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import generator from 'generate-password';

import {user} from 'model/user'
import {transaction} from 'model/transactions'
import {merchant} from 'model/merchant'
import {merchantCount} from 'model/merchantCount'

import {logger} from 'utils/logger'
import {encoder, decoder} from 'utils/jwt'
import {registerGuestSerializer, transactionSerializer} from 'utils/serializer'
import {formatTransactionID, getIPAddress, getFutureDateTimeMins} from 'utils/functions'
import {generateOTP, verifyOTP} from 'utils/passwords'
import {createSMS} from 'utils/smsSettings'
import {sendMail} from 'utils/sendgrid'
import {getMailTemplateGuestTransaction} from 'utils/mailTemplates'
import {generateQRCodeImage} from 'utils/qrCodeGenerator'
import {generateBarcode} from 'utils/barcodeGenerator'

// import fakerator from 'fakerator'

const app = express( feathers() )

const encode = encoder({
	secret         : config.verifierSecret,
	expireInSeconds: 600
})

const decode = decoder({
	secret: config.verifierSecret
})

const transact = ( res, status, data ) => {
	res.status( status ).send( JSON.stringify( data ) )
}

app.post( '/guest', async ( req, res ) => {
  var transactions = req.body.transaction
	var userData = req.body.user
	var isSignup = userData.isSignup == 'on' ? true : false
  var clientIP = req.clientIp
	var ifEmailExist = false
  var ifMobileExist = false
	var newUser = false
	var newTransaction = false
	let token = {}

	const userPassword = generator.generate({
		length: 8,
		numbers: true,
		uppercase: true,
		excludeSimilarCharacters: true,
		strict: true
	});

  // not required to create username and password for the meantime
	// req.body.user.username = fakerator().internet.userName(req.body.user.firstname, req.body.user.lastname)
	// req.body.user.password = userPassword

  const registerGuestUser = registerGuestSerializer( userData )
	const newGuestTransaction = transactionSerializer( transactions )
  const ipAddress = await getIPAddress()

	try {

    if ( /^\s+$/.test( registerGuestUser.email ) ) {
			return transact( res, 400, {error: 'error_no_email_provided'})
		} else if (/^\s+$/.test( registerGuestUser.mobile ) ) {
			return transact( res, 400, {error: 'error_no_mobile_provided'})
		} else if (/^\s+$/.test( registerGuestUser.IDType ) ) {
			return transact( res, 400, {error: 'error_no_id_type_provided'})
		} else if (/^\s+$/.test( registerGuestUser.IDNumber ) ) {
			return transact( res, 400, {error: 'error_no_id_number_provided'})
		}

    if (/^\s+$/.test( newGuestTransaction.merchantCode ) ) {
			return transact( res, 400, {error: 'error_no_merchantCode_provided'})
		} else if (/^\s+$/.test( newGuestTransaction.amount ) ) {
			return transact( res, 400, {error: 'error_no_amount_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.baseCurrency ) ) {
			return transact( res, 400, {error: 'error_no_baseCurrency_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.convertedAmount ) ) {
			return transact( res, 400, {error: 'error_no_convertedAmount_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.convertToCurrency ) ) {
			return transact( res, 400, {error: 'error_no_convertToCurrency_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.exchangeRate ) ) {
			return transact( res, 400, {error: 'error_no_exchangeRate_provided'})
    }

		ifEmailExist = await user.findOne({email: registerGuestUser.email}).countDocuments()
    ifMobileExist = await user.findOne({mobile: registerGuestUser.mobile}).countDocuments()

    if ( ifEmailExist ) {
			return transact( res, 400, {error: 'error_user_email_already_exist'})
		}

    if ( ifMobileExist ) {
			return transact( res, 400, {error: 'error_user_mobile_already_exist'})
		}

		const merchantInfo = await merchant.findByMerchantCode({merchantCode: newGuestTransaction.merchantCode})
		const lastMerchantCount = await transaction.getTransactionCount()
		const transactionID = await formatTransactionID(transactions.merchantCode, lastMerchantCount)

		if (merchantInfo) {
			newUser = await user.register( registerGuestUser )

			newGuestTransaction.merchantID = merchantInfo._id
			newGuestTransaction.userID = newUser
			newGuestTransaction.transactionID = transactionID.toUpperCase()
			newGuestTransaction.ipAddress = clientIP == '::1' ? ipAddress : clientIP
			newGuestTransaction.IDType = registerGuestUser.IDType
			newGuestTransaction.IDNumber = registerGuestUser.IDNumber

			newTransaction = await transaction.createTransaction( newGuestTransaction )
		} else {
			return transact( res, 400, {error: 'merchant not found'})
			logger( {error: 'merchant not found'} )
		}


    if (newUser && newTransaction) {
			const userOTP = await generateOTP()
			const otpDetails = {
				_id      : newUser,
				latestOtp: {
					otp        : userOTP,
				  valid_until: getFutureDateTimeMins( 10 ),
					created    : new Date()
				}
			}
			console.log(userOTP)
			const updateUserOTP = await user.updateUser({...otpDetails})
			if (updateUserOTP) {
				const message = 'Your verification code is' + userOTP + '. Use this to verify your transaction. Do not share this to others '
				// createSMS(message, registerGuestUser.mobile)

				const { _id, email, personalInfo, username } = newUser
				const { transactionID } = newTransaction
				const tokenPayload = { email, _id, userOTP, transactionID }
				token = encode( tokenPayload )

				// temporary removed sending username and password to user
				/*const mailContent = {
					firstname: personalInfo.firstname,
					lastname: personalInfo.lastname,
					suffix: personalInfo.suffix || '',
					token: token,
					username: username,
					password: userPassword
				}*/

				const qrCodeData = {
					firstname: personalInfo.firstname,
					lastname : personalInfo.lastname,
					_id      : _id.toString()
				}

				const qrCodeUrl = await generateQRCodeImage(transactionID, qrCodeData)


				const mailContent = {
					firstname         : personalInfo.firstname,
					transactionID     : transactionID,
					isSignup          : isSignup,
					token             : token,
					qrCodeUrl         : qrCodeUrl.cloudImageUrl,
					barcCodeUrl       : `https://zwap.herokuapp.com/barcode?bcid=code128&text=${transactionID}&height=10&includetext&paddingwidth=3&paddingheight=3`,
					// barcCodeUrl       : `${config.host}:${config.port}/barcode?bcid=code128&text=${transactionID}&height=10&includetext&paddingwidth=3&paddingheight=3`,
					amount            : newGuestTransaction.amount,
					baseCurrency      : newGuestTransaction.baseCurrency,
				  convertedAmount   : newGuestTransaction.convertedAmount,
				  convertToCurrency : newGuestTransaction.convertToCurrency,

				}

				const mailData = {
					receiver_email: email,
					firstname     : personalInfo.firstname,
					lastname      : personalInfo.lastname,
					suffix        : personalInfo.suffix || '',
					html_content  : getMailTemplateGuestTransaction(mailContent)
				}

				sendMail(mailData)
			}

      transact( res, 200, {success: true, data: {token: token}, message: 'Booking and Registration Success. Please verify your account and transaction by entering the OTP we sent to ' + registerGuestUser.mobile})
    } else {
      return transact( res, 400, {error: 'error_saving_data'})
  		logger( {error: 'error_saving_data'} )
    }

	} catch ( e ) {
		transact( res, 400, {error: 'error_saving_data', code: e.code})
		logger( e )
	}
})

app.post( '/verify', async ( req, res ) => {
  var {token, verifyNumber} = req.body

	try {
		const tokenPayload = decode(token)

	  try {

			if (tokenPayload.userOTP == verifyNumber) {
				var search = {
					_id: tokenPayload._id,
					'latestOtp.otp': verifyNumber
				}

				const secondValidationOTP = await verifyOTP(search)

				if ( secondValidationOTP ) {
					const updateUserData = {
						_id: tokenPayload._id,
						verified: new Date(),
						isVerified: true
					}

					const verifyTransaction = await transaction.findOneAndUpdate({transactionID: tokenPayload.transactionID },{isVerified: true, dateVerified: new Date()})
					const verifyUser = await user.updateUser(updateUserData)

					if ( verifyTransaction && verifyUser) {
						transact( res, 200, {success: true, message: 'Your account and transaction is now verified' })
					} else {
						return transact( res, 400, {error: 'error_verifying_account_transaction'})
						logger( {error: 'error_verifying_account_transaction'} )
					}

				} else {
					return transact( res, 400, {error: 'otp_expired'})
					logger( {error: 'otp_expired'} )
				}

			} else {
				return transact( res, 400, {error: 'otp_validation_error'})
				logger( {error: 'otp_validation_error'} )
			}

		} catch ( e ) {
			transact( res, 400, {error: 'otp_validation_error'})
			logger( e )
		}

	} catch ( e ) {
		transact( res, 400, {error: 'otp_validation_error'})
		logger( e )
	}

})
/*


app.post( '/guest', async ( req, res ) => {
	if ( ( await siteStatus() ).isRegistrationBlocked ) {
		res.status( 500 ).send({RegistrationBlocked: true})
	}

	const registerUser = registerGuestSerializer( req.body )

	try {

		const ifExist = await user.findOne({$or: [{email: registerUser.email}, {mobile: registerUser.mobile}]}).countDocuments()

		if ( ifExist ) {
			return register( res, 400, {error: 'error_user_already_exist'})
		}

		if ( registerUser.username && /^\s+$/.test( registerUser.firstname ) ) {
			return register( res, 400, {error: 'error_no_firstname_provided'})
		} else if ( registerUser.password && /^\s+$/.test( registerUser.lastname ) ) {
			return register( res, 400, {error: 'error_no_lastname_provided'})
		} else if ( /^\s+$/.test( registerUser.email ) ) {
			return register( res, 400, {error: 'error_no_email_provided'})
		} else if (/^\s+$/.test( registerUser.mobile ) ) {
			return register( res, 400, {error: 'error_no_mobile_provided'})
		}

		registerUser.transactionPassword = '000000'

		const newUser = await user.register( registerUser )
		register( res, 200, {message: 'Registration Success'})
	} catch ( e ) {
		register( res, 400, {error: 'error_saving_data', code: e.code})
		logger( e )
	}
})
*/
export default app

'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {registerGuestSerializer, transactionSerializer} from 'utils/serializer'
import config from '../../../config'
import {logger} from 'utils/logger'
import {user} from 'model/user'
import {transaction} from 'model/transactions'
import {merchant} from 'model/merchant'
import {merchantCount} from 'model/merchantCount'
import {formatTransactionID, getIPAddress} from 'utils/functions'
import fakerator from 'fakerator'

const app = express( feathers() )

const register = ( res, status, data ) => {
	res.status( status ).send( JSON.stringify( data ) )
}

app.post( '/guest', async ( req, res ) => {
  var transactions = req.body.transaction
  var clientIP = req.clientIp
	var ifEmailExist = false
  var ifMobileExist = false

	req.body.user.username = fakerator().internet.userName(req.body.user.firstname, req.body.user.lastname)

  const registerGuestUser = registerGuestSerializer(req.body.user)
	const newGuestTransaction = transactionSerializer( transactions )
  const ipAddress = await getIPAddress()

	try {

    if ( /^\s+$/.test( registerGuestUser.email ) ) {
			return register( res, 400, {error: 'error_no_email_provided'})
		} else if (/^\s+$/.test( registerGuestUser.mobile ) ) {
			return register( res, 400, {error: 'error_no_mobile_provided'})
		} else if (/^\s+$/.test( registerGuestUser.IDType ) ) {
			return register( res, 400, {error: 'error_no_id_type_provided'})
		} else if (/^\s+$/.test( registerGuestUser.IDNumber ) ) {
			return register( res, 400, {error: 'error_no_id_number_provided'})
		}

    if (/^\s+$/.test( newGuestTransaction.merchantCode ) ) {
			return register( res, 400, {error: 'error_no_merchantCode_provided'})
		} else if (/^\s+$/.test( newGuestTransaction.amount ) ) {
			return register( res, 400, {error: 'error_no_amount_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.baseCurrency ) ) {
			return register( res, 400, {error: 'error_no_baseCurrency_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.convertedAmount ) ) {
			return register( res, 400, {error: 'error_no_convertedAmount_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.convertToCurrency ) ) {
			return register( res, 400, {error: 'error_no_convertToCurrency_provided'})
    } else if (/^\s+$/.test( newGuestTransaction.exchangeRate ) ) {
			return register( res, 400, {error: 'error_no_exchangeRate_provided'})
    }

		ifEmailExist = await user.findOne({email: registerGuestUser.email}).countDocuments()
    ifMobileExist = await user.findOne({mobile: registerGuestUser.mobile}).countDocuments()

    if ( ifEmailExist ) {
			return register( res, 400, {error: 'error_user_email_already_exist'})
		}

    if ( ifMobileExist ) {
			return register( res, 400, {error: 'error_user_mobile_already_exist'})
		}

		const newUser = await user.register( registerGuestUser )
		const merchantInfo = await merchant.findByMerchantCode({merchantCode: newGuestTransaction.merchantCode})
    const lastMerchantCount = await transaction.getTransactionCount()
    const transactionID = await formatTransactionID(transactions.merchantCode, lastMerchantCount)

		newGuestTransaction.merchantID = merchantInfo._id
    newGuestTransaction.userID = newUser
    newGuestTransaction.transactionID = transactionID.toUpperCase()
    newGuestTransaction.ipAddress = clientIP == '::1' ? ipAddress : clientIP

    const newTransaction = await transaction.createTransaction( newGuestTransaction )

    if (newUser && newTransaction) {
      register( res, 200, {success: true, message: 'Guest Booking and Registration Success'})
    } else {
      register( res, 400, {error: 'error_saving_data', code: e.code})
  		logger( e )
    }

	} catch ( e ) {
		register( res, 400, {error: 'error_saving_data', code: e.code})
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

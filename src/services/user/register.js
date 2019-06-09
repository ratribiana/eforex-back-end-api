'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {registerSerializer, registerGuestSerializer} from 'utils/serializer'
import config from '../../../config'
import {logger} from 'utils/logger'
import {user} from 'model/user'
import {encoder} from 'utils/jwt'
import {siteStatus} from 'utils/maintenance'
import {upload, fileUploadtoCloud} from 'utils/uploader'
import {generateQR} from 'utils/qrCodeGenerator'
import {generateBarcode} from 'utils/barcodeGenerator'


const app = express( feathers() )

const encode = encoder({
	secret         : config.verifierSecret,
	expireInSeconds: 900 //15min
})

const register = ( res, status, data ) => {
	res.status( status ).send( JSON.stringify( data ) )
}
app.post( '/', async ( req, res ) => {
	var ifExist = false
	if ( ( await siteStatus() ).isRegistrationBlocked ) {
		res.status( 500 ).send({RegistrationBlocked: true})
	}
  console.log(req.body)
	const registerUser = registerSerializer( req.body )

	 var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	 if(format.test(registerUser.username)) {
		 return register( res, 400, {error: 'error_special_character_not_allowed'})
	 }

	try {
		if ( registerUser.username ) {
			ifExist = await user.findOne({$or: [{username: registerUser.username}, {email: registerUser.email}, {mobile: registerUser.mobile}]}).countDocuments()
		} else {
			ifExist = await user.findOne({$or: [{email: registerUser.email}, {mobile: registerUser.mobile}]}).countDocuments()
		}

		if ( ifExist ) {
			return register( res, 400, {error: 'error_user_already_exist'})
		}

		if ( registerUser.username && /^\s+$/.test( registerUser.username ) ) {
			return register( res, 400, {error: 'error_no_username_provided'})
		} else if ( registerUser.password && /^\s+$/.test( registerUser.password ) ) {
			return register( res, 400, {error: 'error_no_password_provided'})
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

app.post( '/upload', upload.single('photoVerification'), async ( req, res ) => {
	// console.log(req)
	// const qrCodeUrl = await generateQR('test')
	// const barcodeUrl = await generateBarcode('test')
	// console.log(qrCodeUrl)
	// console.log(barcodeUrl)
	// fileUpload(req)
	var data = {
		_id: 'sd4s5d466s5d46s5d4s5d4',
		destination: 'user/verifications/photo/',
    firstname: 'Robert Anthony',
		lastname: 'Tribiana'
	}

	const file = req.file
	await fileUploadtoCloud(file, data).then(uploadedFile => {
		console.log(uploadedFile)
		if (uploadedFile) {
			register( res, 200, {message: 'Uploading File Success'})
		}
	})

})

export default app

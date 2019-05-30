'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {merchant, castMerchantId} from 'model/merchant'
import {merchantSerializer} from 'utils/serializer'
import {capitalizeWords} from 'utils/functions'
import {logger} from 'utils/logger'

const app = express( feathers() )

const resMerchant = ( res, status, data ) => {
	res.status( status ).json( ( data ) )
}

const INVALID_MERCHANT = {error: 'invalid_merchant'}

app.get( '/', async ( req, res ) => {
	const {state, city} = req.body
	try {
		 const result = await merchant.getMerchants()
		 let merchants = []
		  console.log(result)
		 result.map((value) => {
			 let address = {
					addressLine1: value.address.addressLine1 ? capitalizeWords(value.address.addressLine1) : '',
					addressLine2: value.address.addressLine2 ? capitalizeWords(value.address.addressLine2) : '',
					zipCode: value.address.zipCode ? capitalizeWords(value.address.zipCode) : '',
					country: value.address.country ? capitalizeWords(value.address.country) : '',
					state: value.address.state ? capitalizeWords(value.address.state) : '',
					city: value.address.city ? capitalizeWords(value.address.city) : '',
			 }

			 if (value.user[0]) {
				 merchants.push({
					 merchantCode: value.merchantCode,
					 merchantName: value.merchantName,
					 address: address,
					 branches: value.branches,
					 username: value.user[0].username,
					 userEmail: value.user[0].email,
					 userMobile: value.user[0].mobile
			 	 })
			 } else {
				 merchants.push({
					 merchantCode: value.merchantCode,
					 merchantName: value.merchantName,
					 address: address,
					 branches: value.branches
				 })
			 }
		 })
		 if ( result ) {
			 res.status( 200 ).json({merchants: merchants})
		 } else {
			 res.status( 400 ).send( INVALID_LOCATION )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.get('/:merchantID', async ( req, res ) => {
	const {merchantID} = req.params

	const result = await merchant.getMerchant(merchantID)

	try {

		 if ( result ) {
			 resMerchant( res, 200, {merchant: result})
		 } else {
			 logger( e )
			 resMerchant( res, 400, {error: INVALID_MERCHANT})
		 }
	} catch ( e ) {
		logger( e )
		resMerchant( res, 400, {error: req.config.errorUnAuthorized})
	}
})

app.post('/', async ( req, res ) => {
	var ifExistUsingCode = false

	const merchantInfo = merchantSerializer( req.body )

	ifExistUsingCode = await merchant.findOne({merchantCode: merchantInfo.merchantCode}).countDocuments()

	if ( ifExistUsingCode ) {
		return resMerchant( res, 400, {error: 'error_merchant_code_already_exist'})
	}

	const newMerchant = await merchant.createMerchant(merchantInfo)

	try {

		 if ( newMerchant ) {
			 resMerchant( res, 200, {message: 'Merchant Successfully Created'})
		 } else {
			 logger( e )
			 resMerchant( res, 400, {error: INVALID_MERCHANT})
		 }
	} catch ( e ) {
		logger( e )
		resMerchant( res, 400, {error: req.config.errorUnAuthorized})
	}
})

app.put('/:id', async ( req, res ) => {
	const {id} = req.params
	var ifExistUsingCode = false

	const merchantInfo = merchantSerializer( req.body )

	ifExistUsingCode = await merchant.findOne({merchantCode: merchantInfo.merchantCode}).countDocuments()

	if ( ifExistUsingCode ) {
		return resMerchant( res, 400, {error: 'error_merchant_code_already_exist'})
	}

	const updateMerchant = await merchant.updateMerchant(id, merchantInfo)

	try {

		 if ( updateMerchant ) {
			 resMerchant( res, 200, {message: 'Merchant Successfully Updated'})
		 } else {
			 logger( e )
			 resMerchant( res, 400, {error: INVALID_MERCHANT})
		 }
	} catch ( e ) {
		logger( e )
		resMerchant( res, 400, {error: req.config.errorUnAuthorized})
	}
})

app.get( '/location/state/:stateCode', async ( req, res ) => {
	const {stateCode} = req.params
	try {
		 const result = await merchant.findByMerchantByLocation(
			 {'stateCode': stateCode.toUpperCase()}
		 )

		 let merchants = []

		 result.map((value) => {
			let address = {
				 addressLine1: value.address.addressLine1 ? capitalizeWords(value.address.addressLine1) : '',
	 			 addressLine2: value.address.addressLine2 ? capitalizeWords(value.address.addressLine2) : '',
	 			 zipCode: value.address.zipCode ? capitalizeWords(value.address.zipCode) : '',
	 			 country: value.address.country ? capitalizeWords(value.address.country) : '',
	 			 state: value.address.state ? capitalizeWords(value.address.state) : '',
	 			 city: value.address.city ? capitalizeWords(value.address.city) : '',
			}

			 merchants.push({
				 merchantCode: value.merchantCode,
				 merchantName: value.merchantName,
				 address: address,
				 branches: value.branches
			 })
		 })
		 if ( result ) {
			 res.status( 200 ).json({merchants: merchants})
		 } else {
			 res.status( 400 ).send( INVALID_LOCATION )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.get( '/location/city/:cityCode', async ( req, res ) => {
	const {cityCode} = req.params
	try {
		 const resultByCityCode = await merchant.findByMerchantByLocation(
			 {cityCode: cityCode.toUpperCase()}
		 )

		 let merchants = []

		 if (resultByCityCode.length > 0) {
			 resultByCityCode.map((value) => {
				let address = {
					 addressLine1: value.address.addressLine1 ? capitalizeWords(value.address.addressLine1) : '',
		 			 addressLine2: value.address.addressLine2 ? capitalizeWords(value.address.addressLine2) : '',
		 			 zipCode: value.address.zipCode ? capitalizeWords(value.address.zipCode) : '',
		 			 country: value.address.country ? capitalizeWords(value.address.country) : '',
		 			 state: value.address.state ? capitalizeWords(value.address.state) : '',
		 			 city: value.address.city ? capitalizeWords(value.address.city) : '',
				}

				 merchants.push({
					 merchantCode: value.merchantCode,
					 merchantName: value.merchantName,
					 address: address,
					 branches: value.branches
				 })
			 })
		 } else {
			 const resultByCity = await merchant.findByMerchantByLocation(
				 {'address.city': {$regex: new RegExp( '^'+cityCode+'$', 'i' )}}
			 )

			 resultByCity.map((value) => {
				let address = {
					 addressLine1: value.address.addressLine1 ? capitalizeWords(value.address.addressLine1) : '',
		 			 addressLine2: value.address.addressLine2 ? capitalizeWords(value.address.addressLine2) : '',
		 			 zipCode: value.address.zipCode ? capitalizeWords(value.address.zipCode) : '',
		 			 country: value.address.country ? capitalizeWords(value.address.country) : '',
		 			 state: value.address.state ? capitalizeWords(value.address.state) : '',
		 			 city: value.address.city ? capitalizeWords(value.address.city) : '',
				}

				 merchants.push({
					 merchantCode: value.merchantCode,
					 merchantName: value.merchantName,
					 address: address,
					 branches: value.branches
				 })
			 })
		 }



		 if ( resultByCityCode || resultByCity) {
			 res.status( 200 ).json({merchants: merchants})
		 } else {
			 res.status( 400 ).send( INVALID_LOCATION )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.get( '/:merchantID', async ( req, res ) => {
	const {userID} = req.params
	try {
		 const result = await user.findOne({_id: userID, isDeleted: false}).exec()
		 const profile = profileSerializer( result )
		 if ( result ) {
			 res.status( 200 ).send( JSON.stringify({user: profile}) )
		 } else {
			 res.status( 400 ).send( INVALID_USER )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.get( '/location/get-by-locations', async ( req, res ) => {
	const {state, city} = req.params
	try {
		 const result = await merchant.findByMerchantByLocation(
			 {'address.state': state.toLowerCase(), 'address.city': city.toLowerCase()}
		 )
		 let merchants = []
		 result.map((value) => {
			 merchants.push({
				 merchantCode: value.merchantCode,
				 merchantName: value.merchantName,
				 address: value.address
			 })
		 })
		 if ( result ) {
			 res.status( 200 ).json({merchants: merchants})
		 } else {
			 res.status( 400 ).send( INVALID_LOCATION )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

export default app

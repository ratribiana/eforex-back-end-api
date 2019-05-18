'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {merchant, castMerchantId} from 'model/merchant'
import {logger} from 'utils/logger'

const app = express( feathers() )

const INVALID_LOCATION = {error: 'invalid_locations'}


app.post( '/get-by-location', async ( req, res ) => {
	const {state, city} = req.body
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

export default app

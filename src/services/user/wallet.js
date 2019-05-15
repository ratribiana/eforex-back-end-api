'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {logger} from 'utils/logger'
import {user, castUserId} from 'model/user'
import {wallet} from 'model/wallet'
import {walletSerializer} from 'utils/serializer'
import uuid from 'uuid/v1'

const app = express( feathers() )

app.get( '/list', async ( req, res ) => {
	const {userID} = req.body
	try {
     !req.session._id && res.status( 400 ).send( {error: 'session_expired'} )
		 const result = await wallet.find({userID: req.session._id, isDeleted: false}).exec()

		 if ( result ) {
			 res.status( 200 ).send( JSON.stringify({wallets: result}) )
		 } else {
			 res.status( 400 ).send( {message: "no_wallets_found"} )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.post( '/', async ( req, res ) => {
	const {userID} = req.body
	try {
    !req.session._id && res.status( 400 ).send( {error: 'session_expired'} )

		 const userData = await user.findOne({_id: castUserId( req.session._id ), isActive: true}).exec()

     let userWallet = walletSerializer( req.body )
     userWallet.walletAddress = `${uuid().toString()}`.split('-').join('')
     if (userData) {
       userWallet.userID = userData
     } else {
       res.status( 400 ).send( {error: 'user_not_found'} )
     }

     const newWallet = await wallet.createWallet({...userWallet})

		 if ( newWallet ) {
			 res.status( 200 ).send( JSON.stringify({success: 'success_creating_wallet'}) )
		 } else {
			 res.status( 400 ).send( {error: 'error_creating_wallet'} )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.put( '/:walletID', async ( req, res ) => {
	try {
     !req.session._id && res.status( 400 ).send( {error: 'session_expired'} )
		 const result = await wallet.findOneAndUpdate({_id: req.params.walletID}, {isDeleted: true}, {new: true}).exec()

		 if ( result ) {
			 res.status( 200 ).send( JSON.stringify({success: "wallet_successfully_deleted"}) )
		 } else {
			 res.status( 400 ).send( {error: "error_deleting_wallet"} )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

export default app

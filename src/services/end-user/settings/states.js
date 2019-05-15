'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {state} from 'model/state'
import {logger} from 'utils/logger'
import {capitalizeWords} from 'utils/functions'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.json( data )
}

app.get( '/:countryCode', async ( req, res ) => {
	try {
		const result = await state.getStates( req.params.countryCode.toUpperCase() )
		var states = []
		result.map(state => {
				states.push({
					id: state._id,
					stateName: capitalizeWords(state.name),
					stateCode: state.stateCode,
					cities: state.cities
				})
		})
		response( 200, states, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app

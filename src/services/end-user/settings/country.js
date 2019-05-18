'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {country} from 'model/country'
import {logger} from 'utils/logger'
import {capitalizeWords} from 'utils/functions'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.json( data )
}

app.get( '/', async ( req, res ) => {
	try {
		const result = await country.getCountries()
		var countries = []
		result.map(country => {
				countries.push({
					countryName: capitalizeWords(country.countryName),
					countryCode: country.countryCode
				})
		})
		response( 200, countries, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

app.get( '/:countryID', async ( req, res ) => {
	try {
		const result = await country.findById({_id: req.params.countryID})
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app

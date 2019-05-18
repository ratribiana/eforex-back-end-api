'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {logger} from 'utils/logger'
import {getExchangeRate, updateExchangeRate} from 'utils/exchangeRateCron'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.json(data)
}

app.get( '/', async ( req, res ) => {
	// console.log(req.useragent);
	//console.log(req.session);
	try {
    const result = await getExchangeRate()
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

app.get( '/get-rates', async ( req, res ) => {
	try {
    const result = await updateExchangeRate()

    result.then(value => {
      if (value.success) {
        response( 200, value, res )
      }
    })

	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app

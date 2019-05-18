'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {logger} from 'utils/logger'
import {documentTypes} from 'model/documentTypes'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.json(data)
}

app.get( '/', async ( req, res ) => {
	try {
    const result = await documentTypes.getDocumentTypesLocal()
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app

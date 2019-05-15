import 'babel-polyfill'
import 'app-module-path/register'
import logger from 'winston'
import cluster from 'cluster'
import app from './app'
import config from '../config'
import mongoose from 'mongoose'
import {dbConnect} from 'utils/dbConnector'
import {updateExchangeRate} from 'utils/exchangeRateCron'

dbConnect( config )
updateExchangeRate()

const serverUp = ( app ) => {
	const server = app.listen( config.port )
	process.on( 'unhandledRejection', ( reason, p ) =>
		logger.error( 'Unhandled Rejection at: Promise ', p, reason )
	)
	server.on( 'listening', () =>
		logger.info( 'Node-Feathers application started on http://%s:%d', config.host,  config.port )
	)
}
serverUp( app )

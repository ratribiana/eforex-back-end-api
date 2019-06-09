'use strict'

import path from 'path'
import favicon from 'serve-favicon'
import compress from 'compression'
import cookieSession from 'cookie-session'
import cors from 'cors'
import helmet from 'helmet'
import logger from 'winston'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import socketio from '@feathersjs/socketio'
import useragent from 'express-useragent'
import uuid4 from 'uuid/v1'
import requestIp from 'request-ip'
import services from './services'
import appHooks from './app.hooks'
import config from '../config'
import {siteStatus} from 'utils/maintenance'

const configuration = async ( req, res, next ) => {
	if ( ( await siteStatus() ).isMaintenance ) {
		return res.status( 500 ).send({maintenance: true})
	}
	req.session.sessionID = uuid4()
	req.config = config
	req.currentUrl = config.env == 'production' ? config.host: `${config.host}:${config.port}`
	req.frontEndUrl = config.feDomain
	req.rootDir = path.join( __dirname,'/' )
	next()
}

const app = express( feathers() )

app.use( cookieSession({name: 'session',	keys: [config.secret]}) )
app.use( requestIp.mw() )
app.use( cors() )
app.use( configuration )

app.get('/', (req, res) => {
  res.status(200).json({ message: "Api is working good"}).end();
});
app.use('/assets', express.static('src/public/files/'));

app.use( helmet() )
app.use( compress() )
app.use( useragent.express() );
app.use( express.json() )
app.use( express.urlencoded({extended: true}) )
app.configure( express.rest() )
app.configure( socketio() )
app.configure( services )
app.use( express.errorHandler({logger}) )
app.hooks( appHooks )

module.exports = app

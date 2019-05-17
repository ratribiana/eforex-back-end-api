'use strict'
import 'babel-polyfill'
import 'app-module-path/register'
import config from '../config'
import {dbConnect} from 'utils/dbConnector'
import mongoose from 'mongoose'

import {users} from 'seeds/users.seed.js'
import {siteStatus} from 'seeds/maintenance.seed.js'
import {merchants} from 'seeds/merchants.seed.js'
import {countries} from 'seeds/country.seed.js'
import {states} from 'seeds/phState.seed.js'

( async () => {
	dbConnect( config )

	if ( config.env=='development' || config.env == 'test' ) {
		await siteStatus()
		await countries()
		await states()
		await users( 2 )
		await merchants( 2 )
	}
	process.exit()
})()

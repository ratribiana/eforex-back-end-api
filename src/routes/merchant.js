'use strict'
import {authorizer} from 'utils/authorizer'
import merchants from 'services/merchant'

export default  ( app ) => {
	app.use( '/merchants', merchants )
}

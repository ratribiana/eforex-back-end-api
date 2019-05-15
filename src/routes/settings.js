'use strict'
import {authorizer} from 'utils/authorizer'
import country from 'services/end-user/settings/country'
import states from 'services/end-user/settings/states'

export default  ( app ) => {
	app.use( '/countries', country )
	app.use( '/states', states )
}

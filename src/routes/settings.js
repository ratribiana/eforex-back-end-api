'use strict'
import {authorizer} from 'utils/authorizer'
import country from 'services/end-user/settings/country'
import states from 'services/end-user/settings/states'
import documentTypes from 'services/end-user/settings/documentTypes'

export default  ( app ) => {
	app.use( '/countries', country )
	app.use( '/states', states )
	app.use( '/id-types', documentTypes )
}

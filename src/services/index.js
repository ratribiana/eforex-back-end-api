'use strict'
import endUser from 'routes/endUser'
import merchant from 'routes/merchant'
import settings from 'routes/settings'
import tools from 'routes/tools'
import transactions from 'routes/transactions'
import user from 'routes/user'

export default  ( app ) => {
	endUser( app )
	merchant( app )
	settings( app )
	tools( app )
	transactions( app )
	user( app )
}

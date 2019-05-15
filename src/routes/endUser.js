'use strict'
import {authorizer} from 'utils/authorizer'

import ewalletActivity from 'services/end-user/user/ewalletActivity'
import profile from 'services/end-user/user/profile'
import accountStatement from 'services/end-user/general/accountStatement'
import maintenance from 'services/end-user/tools/maintenance'


export default  ( app ) => {
	app.use( '/user-profile', authorizer(), profile )
	app.use( '/user-ewallet-activity', authorizer(), ewalletActivity )
	app.use( '/user-maintenance', authorizer(), maintenance )
}

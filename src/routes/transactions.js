'use strict'
import {authorizer} from 'utils/authorizer'
import transaction from 'services/transactions/booking'
import transactionHistory from 'services/transactions/history'


export default  ( app ) => {
	app.use( '/transact', transaction )
	app.use( '/transactions/', transactionHistory )
}

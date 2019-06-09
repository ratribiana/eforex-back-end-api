'use strict'
import {authorizer} from 'utils/authorizer'
import maintenance from 'services/maintenance'
import exchangeRate from 'services/end-user/settings/exchangeRate'
import generateBarcode from 'services/end-user/tools/generateBarcode'

export default  ( app ) => {
	app.use( '/maintenance', authorizer( ['tools','siteMentainanceMode'] ), maintenance )
	app.use( '/exchange-rate', exchangeRate )
	app.use( '/barcode', generateBarcode )
}

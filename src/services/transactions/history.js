'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {registerGuestSerializer, transactionSerializer} from 'utils/serializer'
import config from '../../../config'
import {logger} from 'utils/logger'
import {transaction} from 'model/transactions'

const app = express( feathers() )

const transactionData = ( res, status, data ) => {
	res.status( status ).json( ( data ) )
}

app.get( '/:offset/:limit', async ( req, res ) => {
  const {limit, offset} = req.params

	try {
    const transactions = await transaction.getTransactions(offset, limit)

    if (transactions) {
      transactionData( res, 200, {transactions: transactions})
    } else {
      transactionData( res, 400, {error: 'error_retrieving_data', code: e.code})
      logger( e )
    }

  } catch ( e ) {
    transactionData( res, 400, {error: 'error_retrieving_data', code: e.code})
    logger( e )
  }
})

export default app

'use strict'
import {wallet} from 'model/wallet'
import {user} from 'model/user'
import faker from 'faker'
import uuid from 'uuid/v1'

export const wallets = async (length, userData) => {
	try {
		for ( let i = 0; i < length; i++ ) {
			const WALLET =
          {
          	balance       		: faker.finance.amount(),
          	walletAddress     : `${uuid().toString()}`.split('-').join(''),
            label             : 'My Wallet ' + (i + 1),
            userID            : userData
          }
			const newWallet = await wallet.createWallet({...WALLET})
		}
		console.log( 'seeding-wallet-done' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}

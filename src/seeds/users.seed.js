'use strict'
import {user} from 'model/user'
import faker from 'faker'
import {wallets} from 'seeds/wallet.seed.js'

export const users = async ( length ) => {
	try {
		let gender = ['Male', 'Female'];
		// console.log(faker.random.arrayElement(gender));
		let personalInfo = {
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			gender: gender[faker.random.number() % gender.length],
			dateOfBirth:faker.date.past()
		}
		for ( let i = 0; i < length; i++ ) {
			const FAKE_USER =
          {
          	username       		 : faker.internet.userName(),
          	password       		 : 'P@ssw0rd01',
          	email          		 : faker.internet.email(),
						personalInfo	 		 : personalInfo,
						totalCashBalance	 : 1000,
						transactionPassword: '000000',
          	verified					 : Date.now(),
						mobile						 : '+63-' + faker.phone.phoneNumberFormat()
          }
			const newUser = await user.register({...FAKE_USER})

			await wallets( 2, newUser)
		}
		console.log( 'seeding-users-done' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}

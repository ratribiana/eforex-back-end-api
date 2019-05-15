'use strict'
import {user} from 'model/user'
import {merchant} from 'model/merchant'
import {merchantCount} from 'model/merchantCount'
import faker from 'faker'

export const merchants = async ( length ) => {
	try {
		let gender = ['Male', 'Female'];
    let company = [
      {
        name: 'Palawan Express',
        code: 'PE'
      },
      {
        name: 'Cebuana Lhuillier',
        code: 'CL'
      }
    ]

    await merchantCount.createMerchantCount(1)

		let personalInfo = {
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			gender: gender[faker.random.number() % gender.length],
			dateOfBirth:faker.date.past()
		}

		for ( let i = 0; i < length; i++ ) {
			const FAKE_USER = {
      	username       		 : faker.internet.userName(),
      	password       		 : 'P@ssw0rd01',
      	email          		 : faker.internet.email(),
				personalInfo	 		 : personalInfo,
				totalCashBalance	 : 0,
				transactionPassword: '000000',
      	verified					 : Date.now(),
				mobile						 : '+63-' + faker.phone.phoneNumberFormat()
      }

			const newUser = await user.register({...FAKE_USER})

      const count = await merchantCount.getlastCount()
      var concatString = '000'

      if (String(count).length == 2) {
        concatString = '00'
      } else if (String(count).length == 3) {
        concatString = '0'
      }
      var merchantCode = company[i].code + concatString + count

      const FAKE_MERCHANT = {
        merchantCode: merchantCode,
        userID: newUser,
        merchantName: company[i].name,
        address: {
          addressLine1: faker.address.streetAddress(),
          addressLine2: faker.address.secondaryAddress(),
          city: faker.address.city(),
          state: faker.address.state(),
          country: faker.address.county(),
          zipCode: faker.address.zipCode()
        }
      }

      const newMerchant = await merchant.createMerchant({...FAKE_MERCHANT})
      const newCount = await merchantCount.createMerchantCount(i+1)
		}

		console.log( 'seeding-merchants-done' )
	} catch ( e ) {
		console.log( 'seeding-merchants-error',e )
	}
}

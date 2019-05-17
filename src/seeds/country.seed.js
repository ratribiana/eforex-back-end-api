'use strict'
import {country} from 'model/country'
import config from '../../config'
import {countryList} from './volumes/countryInfo'

export const countries = async () => {
	try {
		countryList.map( async ( countryInfo ) => {

			var countryData = {
				countryName: countryInfo.countryName,
				countryCode: countryInfo.countryCode,
				phoneCode: countryInfo.phoneCode,
				isoCode: countryInfo.isoCode,
				capital: countryInfo.capital,
				region: countryInfo.region,
				timezones: countryInfo.timezones,
				currencyCode: countryInfo.currencyCode,
				currencyName: countryInfo.currencyName
			}

			const result = await country.createCountry( countryData )
		})
		console.log( 'seeding-done-country' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}

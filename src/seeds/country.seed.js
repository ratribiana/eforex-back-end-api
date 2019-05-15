'use strict'
import {country} from 'model/country'
import config from '../../config'
import {countryList} from './volumes/countries'

export const countries = async () => {
	try {
		countryList.map( async ( countryInfo ) => {
			console.log(countryInfo)
			const result = await country.create( countryInfo )
		})
		console.log( 'seeding-done-country' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}

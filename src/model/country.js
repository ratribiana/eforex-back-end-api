'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose
mongoose.plugin( require( 'mongoose-regex-search' ) )

const schema = new Schema({
	countryName: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true,
		lowercase : true
	},
	countryCode: {
		type      : String,
		required  : true,
		index     : true,
		unique	  : 'countryCode_already_exist',
		searchable: true
	},
	phoneCode: {
		type      : String,
		index     : true,
		searchable: true,
		default   : ''
	},
	isoCode: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true,
		default   : ''
	},
	capital: {
		type      : String,
		searchable: true,
		default   : ''
	},
	region: {
		type      : String,
		searchable: true,
		default   : ''
	},
	timezones: {
		type      : String,
		searchable: true,
		default   : ''
	},
	currencyCode: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true,
	},
	currencyName: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true,
		default   : ''
	},
	isActive: {
		type   : Boolean,
		default: true
	},
	isDeleted: {
		type   : Boolean,
		default: false
	}
})

export class CountryClass {
	static async createCountry ( country ) {
		console.log(country)
		const created = await this.create( country )
		return created
	}
	static getCountries () {
		return this.find({isActive: true}).sort({name: 'asc'}).exec()
	}
	static findByCountry ( countryName ) {
		return this.findOne({countryName}).exec()
	}
	static findByCountryCode ( countryCode ) {
		return this.findOne({countryCode}).exec()
	}
}

schema.loadClass( CountryClass )

export const country = mongoose.model( 'Countries', schema )

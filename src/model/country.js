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
		required  : true,
		index     : true,
		searchable: true
	},
	isoCode: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true
	},
	isActive: {
		type   : Boolean,
		default: true
	}
})

export class CountryClass {
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

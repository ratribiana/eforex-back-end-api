'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose
mongoose.plugin( require( 'mongoose-regex-search' ) )

const cities = new Schema({
	name: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true,
		lowercase : true
	},
	cityCode: {
		type      : String,
		index     : true,
		searchable: true,
		default   : ''
	},
	stateCode: {
		type      : String,
		default   : ''
	}
})

const schema = new Schema({
	name: {
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
		searchable: true
	},
	stateCode: {
		type      : String,
		required  : true,
		index     : true,
    unique    : 'stateCode_already_exists',
		searchable: true
	},
  cities: {
		type      : [cities],
    default: []
	},
  region: {
		type      : String,
    dafeult   : ''
	},
	isActive: {
		type   : Boolean,
		default: true
	}
})

export class StateClass {
  static async saveState ( stateInfo ) {
    const created = await this.create( stateInfo )
    return created
  }

  static async getStates ( countyCode ) {
    const states = await this.find({countryCode: String(countyCode), isActive: true}).sort({name: 'asc'}).exec()
    return states
  }

	static async findByStateCode ( state ) {
		return await this.findOne({state}).exec()
	}
}

schema.loadClass( StateClass )

export const state = mongoose.model( 'States', schema )

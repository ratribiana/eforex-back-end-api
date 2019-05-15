'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'

mongoose.set('useFindAndModify', false);

const {Schema} = mongoose

const schema = new Schema({
  merchantCode: {
    type    : String,
		default : '',
    searchable: true,
		required: true
	},
  userID: {
    type: Schema.ObjectId,
    searchable: true,
    ref : 'Users'
  },
  merchantName: {
    type    : String,
    default : '',
    searchable: true,
		required: true
  },
  address: new Schema({
    addressLine1: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		},
		addressLine2: {
			type   : String,
			default: ''
		},
		zipCode: {
			type   : String,
			default: ''
		},
		country: {
			type      : String,
			required  : true,
			index     : true,
			searchable: true,
			lowercase : true,
			default   : ''
		},
		state: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		},
		city: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		}
  }),
  branches:  [{
  	type: Schema.ObjectId,
  	ref : 'Merchants'
  }],
  parentMerchant: {
    merchantID: {
			type: Schema.ObjectId,
			ref : 'Merchants'
		}
  },
  isDeleted: {
    type   : Boolean,
		default: false
  },
  adminCreatedBy: {
		userID: {
			type: Schema.ObjectId,
			ref : 'Users',
      searchable: true,
		}
	},
  dateCreated: {
    type    : Date,
		default : Date.now,
    required: true
	},
  dateUpdated: {
    type    : Date,
		default : Date.now,
    required: true
	}
})

export class merchantClass{
  static async createMerchant ( merchant ) {
		const created = await this.create(
			merchant
		)
		return created
	}

  static async findByMerchantByLocation ( location ) {
    return this.find(location).sort({merchantName: 'asc'}).exec()
  }

  static async findByMerchantID ( merchantID ) {
		return this.find({merchantID}).exec()
	}

	static async findByMerchantCode ( merchantCode ) {
		return this.findOne({merchantCode}).exec()
	}
}
schema.loadClass( merchantClass )
export const castMerchantId = ( userId ) => mongoose.Types.ObjectId( merchantId )
export const merchant = mongoose.model( 'Merchants', schema )

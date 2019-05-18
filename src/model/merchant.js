'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'

mongoose.set('useFindAndModify', false);
const ObjectID = require( 'mongodb' ).ObjectID

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
    ref : 'Users',
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
      lowercase : true,
			default   : ''
		},
		city: {
			type      : String,
			index     : true,
			searchable: true,
      lowercase : true,
			default   : ''
		}
  }),
  countryCode: {
    type      : String,
    searchable: true
  },
  stateCode: {
    type      : String,
    searchable: true
  },
  cityCode: {
    type      : String,
    searchable: true
  },
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

  static async getMerchants ( skip = 0 , limit = 0 ) {
    var query = [
        {$skip: parseInt(skip)},
        {
          $lookup: {
            from: 'users',
            localField: 'userID',
            foreignField: '_id',
            as: 'user'
          }
        }
      ]

      if (limit > 0) {
        query.push({$limit: parseInt(skip) + parseInt(limit)})
      }

    const merchants = await this.aggregate(query)
		return  merchants
	}

  static async getMerchant ( merchantID ) {
    var query = [
        {
          $match: {
            _id: new ObjectID(merchantID)
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userID',
            foreignField: '_id',
            as: 'user'
          }
        }
      ]

    const merchant = await this.aggregate(query)
		return  merchant
	}

  static async findByMerchantByLocation ( location ) {
    return this.find(location).sort({merchantName: 'asc'}).exec()
  }

  static async findByMerchantID ( merchantID ) {
		return this.findById(merchantID)
	}

	static async findByMerchantCode ( merchantCode ) {
		return this.findOne(merchantCode)
	}

  static async updateMerchant ( merchantID, merchant ) {
    return this.findOneAndUpdate(
      { _id: new ObjectID( merchantID ) },
      { $set: merchant }
     )
  }

}
schema.loadClass( merchantClass )
export const castMerchantId = ( userId ) => mongoose.Types.ObjectId( merchantId )
export const merchant = mongoose.model( 'Merchants', schema )

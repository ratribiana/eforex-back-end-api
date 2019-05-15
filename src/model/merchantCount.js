'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'

const {Schema} = mongoose

const schema = new Schema({
  count: {
    type    : Number,
    searchable: true,
		default: 0
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

export class merchantCountClass{
  static async createMerchantCount ( merchantCount ) {

    const created = await this.findOneAndUpdate(
     {},
     { $set: { "count" : merchantCount } },
     { upsert: true }
    )
    const count = await this.find().exec()
    return count[0].count
	}

  static async getlastCount ( ) {
    const count = await this.find().exec()
    return count[0].count
	}

}
schema.loadClass( merchantCountClass )
export const merchantCount = mongoose.model( 'MerchantCount', schema, 'merchantCount' )

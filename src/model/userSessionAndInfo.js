'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'
import user from 'model/user'

mongoose.set('useFindAndModify', false);

const {Schema} = mongoose

const schema = new Schema({
  userID: {
    type: Schema.ObjectId,
    searchable: true,
    ref : 'Users',
    required: true
  },
  sessionID: {
    type    : String,
    default : '',
    unique    : 'sessionID_already_exist',
    searchable: true,
		required: true
  },
  userAgent: {
		type      : Array,
    default: []
	},
  isDeleted: {
    type   : Boolean,
		default: false
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

export class UserSessionAndInfoClass{
  static async createSessionAndInfo ( sessionAndInfo ) {
		const created = await this.create(
			sessionAndInfo
		)
		return created
	}

  static findBySessionID ( sessionID ) {
		return this.find({sessionID}).exec()
	}

  static findByUserID ( userID ) {
		return this.find({userID}).exec()
	}
}
schema.loadClass( UserSessionAndInfoClass )
export const castMerchantId = ( userId ) => mongoose.Types.ObjectId( merchantId )
export const merchant = mongoose.model( 'UserSessionAndInfo', schema, 'userSessionAndInfo' )

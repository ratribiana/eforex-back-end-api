'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'
import {hash} from 'utils/passwords'

export const  PASSWORD_SALT = config.secret
const {Schema} = mongoose

const schema = new Schema({
	balance: {
    type   : Number,
    default: 0,
		required: true
	},
	walletAddress: {
		type    : String,
		default : '',
		required: true
	},
	label: {
		type    : String,
		default : '',
		required: true
	},
  userID: {
    type: Schema.Types.ObjectId,
		ref : 'Users'
	},
  isDeleted: {
    type   : Boolean,
		default: false
  },
  dateCreated: {
    type    : Date,
		default : Date.now,
    required: true
	}
})

export class walletClass{
  static async createWallet ( wallet ) {
		const created = await this.create(
			Object.assign( wallet, {
				walletAddress: wallet.walletAddress && hash( wallet.walletAddress, PASSWORD_SALT ),
			})
		)
		return created
	}

  static findByUserID ( userID ) {
		return this.find({userID}).exec()
	}

	static findByWalletID ( _id ) {
		return this.findOne({_id}).exec()
	}
}
schema.loadClass( walletClass )
export const wallet = mongoose.model( 'Wallet', schema )

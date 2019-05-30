'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'
import user from 'model/user'


const {Schema} = mongoose

const schema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	transactionID: {
		type    : String,
		default : '',
		required: true,
    unique    : 'transactionID_already_exist',
    index     : true
	},
  merchantID: {
    type: Schema.Types.ObjectId,
    ref: 'Merchants'
  },
  ipAddress: {
    type: String,
    default : '',
  },
  amount: {
    type   : Number,
		default: 0.00,
    required: true
  },
  baseCurrency: {
    type   : String,
    default: '',
    required: true
  },
  convertedAmount: {
    type   : Number,
		default: 0.000000000,
    required: true
  },
  convertToCurrency: {
    type   : String,
    default: '',
    required: true
  },
  exchangeRate: {
    type   : Number,
    default: 0.000000000,
    required: true
  },
  IDType: {
		type    : String,
		default : '',
    required: true,
		searchable: true
	},
	IDNumber: {
		type    : String,
		default : '',
    required: true,
		searchable: true
	},
  isVerified: {
    type   : Boolean,
		default: false
  },
  dateVerified: {
    type   : Date,
		default: null
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
  updatedBy: {
    type: Schema.ObjectId,
    ref : 'Users'
  },
  dateUpdated: {
    type   : Date,
    default: Date.now
  }

})

export class TransactionClass{
  static async createTransaction ( transaction ) {
		const created = await this.create(transaction)
		return created
	}

  static async getTransactionCount () {
    const transactions = await this.find().exec()
    return transactions.length
  }

  static async getTransactions ( skip = 0 , limit = 0 ) {

    var query = [
        {$skip: parseInt(skip)},
        {
          $lookup: {
            from: 'merchants',
            localField: 'merchantID',
            foreignField: '_id',
            as: 'merchant'
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

      if (limit > 0) {
        query.push({$limit: parseInt(skip) + parseInt(limit)})
      }

    const transactions = await this.aggregate(query)
		return  transactions
	}
}
schema.loadClass( TransactionClass )
export const transaction = mongoose.model( 'Transactions', schema )

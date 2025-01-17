'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'

mongoose.set('useFindAndModify', false);

const {Schema} = mongoose

const schema = new Schema({
  base: {
    type: String,
    required: true,
    default : ''
  },
  countryCode: {
    type: String,
    required: true,
    default : ''
  },
  currencyName: {
    type: String,
    default : ''
  },
  currencySymbol: {
    type: String,
    default : ''
  },
  rates: {
    type: Array,
    required: true,
    default: []
  },
	date: {
    type    : Date,
		default : '',
    required: true
  },
  dateCreated: {
    type    : Date,
		default : Date.now,
    required: true
	},
  dateUpdated: {
    type   : Date,
    default: Date.now
  }

})

export class ExchangeRateClass{
  static async saveExchangeRate ( rates ) {
    const created = await this.findOneAndUpdate(
     { "base" : rates.base },
     { $set: {
          "rates" : rates.rates,
          "date"  : rates.date,
          "countryCode": rates.countryCode,
          "currencyName": rates.currencyName,
          "currencySymbol": rates.currencySymbol
        } },
     { upsert: true }
    )
		// const created = await this.create( rates )
		return created
	}

  static async getExchangeRate () {
    const rates = await this.find().sort({base: 1})
    const newRates = []
    const result = rates.map(function(rate){
      newRates.push({
        base: rate.base,
        countryCode: rate.countryCode,
        currencyName: rate.currencyName,
        currencySymbol: rate.currencySymbol,
        rates: rate.rates,
      })
    })

    return newRates
  }
}
schema.loadClass( ExchangeRateClass )
export const exchangeRate = mongoose.model( 'ExchangeRate', schema, 'exchangeRates' )

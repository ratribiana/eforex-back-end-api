'use strict'
import {logger} from 'utils/logger'
import {exchangeRate} from 'model/exchangeRates'
import axios from 'axios'

const getRates = async (currency) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://api.exchangeratesapi.io/latest?base=${currency}`)
     .then(function (response) {
        return resolve(response)
     })
     .catch(function (error) {
       return reject(error)
       logger(error)
     });
  })
}

export const updateExchangeRate = async (currency) => {
  var rates = []
  var currencies = ['AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MYR', 'MXN', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR']

  currencies.map(async currency => {
    return await getRates(currency).then(resp => {
      exchangeRate.saveExchangeRate(resp.data)
    })
  })
  console.log('exchange rate updated')
  return Promise.resolve({success: true})
}

export const getExchangeRate = async () => await exchangeRate.getExchangeRate()

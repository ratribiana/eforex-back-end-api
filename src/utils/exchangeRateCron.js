'use strict'
import {logger} from 'utils/logger'
import {exchangeRate} from 'model/exchangeRates'
import {countryList} from 'seeds/volumes/countryInfo'
import axios from 'axios'
import lodash from 'lodash'

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
  var currencyFlags = {AUD: 'AU', BGN: 'BG', BRL:'BR', CAD:'CA', CHF:'CH', CNY:'CN', CZK:'CZ', DKK:'DK', EUR:'EU', GBP:'GB', HKD:'HK', HRK:'HR', HUF:'HU', IDR:'ID', ILS:'IL', INR:'IN', ISK:'IS', JPY:'JP', KRW:'KR', MYR:'MY', MXN:'MX', NOK:'NO', NZD:'NZ', PHP:'PH', PLN:'PL', RON:'RO', RUB:'RU', SEK:'SE', SGD:'SG', THB:'TH', TRY:'TR', USD:'US', ZAR:'ZA'}
  var currencies = ['AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'CNY', 'CZK', 'DKK', 'EUR', 'GBP', 'HKD', 'HRK', 'HUF', 'IDR', 'ILS', 'INR', 'ISK', 'JPY', 'KRW', 'MYR', 'MXN', 'NOK', 'NZD', 'PHP', 'PLN', 'RON', 'RUB', 'SEK', 'SGD', 'THB', 'TRY', 'USD', 'ZAR']

  currencies.map(async currency => {
    return await getRates(currency).then(resp => {
      var baseCurrencyName = ''
      var baseCurrencySymbol = ''
      var rateCountryCode = ''
      var rateCurrencyName = ''
      var rateCurrencySymbol = ''
      var rates = []

      var baseCurrencyCountry = lodash.filter(countryList, {currencyCode: resp.data.base})
      var baseCountryCode = currencyFlags[resp.data.base]

      if (baseCurrencyCountry[0].hasOwnProperty('currencyName')) {
        baseCurrencyName = baseCurrencyCountry[0].currencyName
      }
      if (baseCurrencyCountry[0].hasOwnProperty('currencySymbol')) {
        baseCurrencySymbol = baseCurrencyCountry[0].currencySymbol
      }
      Object.keys(resp.data.rates).map(function(key){
        // console.log(resp.data.rates[key])
        // console.log(key)
        var currencyCountry = lodash.filter(countryList, {currencyCode: key})
        var rateCountryCode = currencyFlags[key]
        // console.log(currencyCountry[0].countryCode)

        if (currencyCountry[0].hasOwnProperty('currencyName')) {
          rateCurrencyName = currencyCountry[0].currencyName
        }
        if (currencyCountry[0].hasOwnProperty('currencySymbol')) {
          rateCurrencySymbol = currencyCountry[0].currencySymbol
        }
        // console.log(rateCountryCode)
        // console.log(currencyCountry[0].countryCode)
        rates.push({
          currency: key,
          rate: resp.data.rates[key],
          countryCode: rateCountryCode,
          currencyName: rateCurrencyName,
          currencySymbol: rateCurrencySymbol
        })
      })
      resp.data.countryCode = baseCountryCode
      resp.data.currencyName = baseCurrencyName
      resp.data.currencySymbol = baseCurrencySymbol
      resp.data.rates = rates

      // console.log(resp.data)
      exchangeRate.saveExchangeRate(resp.data)
    })
  })
  console.log('exchange rate updated')
  return Promise.resolve({success: true})
}

export const getExchangeRate = async () => await exchangeRate.getExchangeRate()

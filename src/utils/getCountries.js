'use strict'
import {logger} from 'utils/logger'
import axios from 'axios'
import fs from 'fs'
import path from 'path'

const data = []
var response = []

const getCountries = async (currency) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://restcountries.eu/rest/v2/all`)
     .then(function (response) {
       var countriesNew = []
       response.data.map(value => {
         countriesNew.push({
           countryName: value.name,
           countryCode: value.alpha2Code,
           phoneCode: value.callingCodes[0],
           isoCode: value.alpha3Code,
           capital: value.capital,
           region: value.region,
           timezones: value.timezones[0],
           currencyCode: value.alpha2Code == 'SG' ? value.currencies[1].code : value.currencies[0].code,
           currencyName: value.currencies[0].name,
           currencySymbol: value.currencies[0].symbol
         })
       })
        return resolve(countriesNew)
     })
     .catch(function (error) {
       return reject(error)
       logger(error)
     });
  })
}

export const updateCountries = async (currency) => {
  const countries = await getCountries()
  const newFilePath = `${path.join( __dirname,'../'+'seeds/volumes/')}countryInfo.js`
  try {
    fs.writeFileSync(newFilePath, JSON.stringify(countries))

    var data = fs.readFileSync(newFilePath)
    var fd = fs.openSync(newFilePath, 'w+')
    var buffer = new Buffer('export const countryList=')

    fs.writeSync(fd, buffer, 0, buffer.length, 0)
    fs.writeSync(fd, data, 0, data.length, buffer.length)
    fs.close(fd);

    /*fs.appendFile(newFilePath, 'var test=', function (err) {
      if (err) throw err;
      console.log('Updated!');
    });*/
    console.log('File Saved!');
  } catch (err) {
    console.error(err)
  }
}

export const newCountries = async () => await updateCountries()

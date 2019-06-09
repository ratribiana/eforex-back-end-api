const generator = require('generate-password');
import {logger} from 'utils/logger'
import axios from 'axios'
import dateFormat from 'dateformat'

export const getIPAddress = (str) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://jsonip.com`)
     .then(function (response) {
        return resolve(response.data.ip)
     })
     .catch(function (error) {
       return reject(error)
       logger(error)
     });
  })
}

export const capitalizeWords = (str) => {
	return str.toLowerCase()
				    .split(' ')
				    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
				    .join(' ')
}

export const formatTransactionID = (merchantID, lastCount) => {

  var concatString = '00000'
  var count = lastCount + 1

  var lastBlock = generator.generate({
    length: 6,
    numbers: true,
    uppercase: true,
    excludeSimilarCharacters: true,
    strict: true
  });

  if (String(lastCount).length == 2) {
    concatString = '0000'
  } else if (String(lastCount).length == 3) {
    concatString = '000'
  } else if (String(lastCount).length == 4) {
    concatString = '00'
  } else if (String(lastCount).length == 5) {
    concatString = '0'
  }

  const transactionID = merchantID + '-' + concatString + count + '-' + lastBlock

  return transactionID
}

export const getFutureDateTimeMins = ( addedMins ) => {
  var now = new Date()
  now.setMinutes(now.getMinutes() + addedMins) // timestamp
  return new Date(now)
}

export const createFileName = ( userData, text = null ) => {
  const fname = userData.firstname.split(' ').join('-')
  const lastname = userData.lastname.split(' ').join('-')
  if (text) {
    return text + dateFormat(new Date, 'yyyymmddHHMMss') + '-' + fname + '-' + lastname + '.png'
  } else {
    return dateFormat(new Date, 'yyyymmddHHMMss') + '-' + fname + '-' + lastname + '.png'
  }
}

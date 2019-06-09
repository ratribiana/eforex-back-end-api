'use strict'
import config from '../../config'

import {upload, fileUploadtoCloud} from 'utils/uploader'
import {createFileName} from 'utils/functions'

import QRCode from 'qrcode'
import path from 'path'
import dateFormat from 'dateformat'

export const generateQRCodeUrl = async text => {
  try {
    return await QRCode.toDataURL(text)
  } catch (err) {
    console.error(err)
  }
}

export const generateQRCodeImage = async (text, data) => {
  try {
    const qrImageFilename = createFileName(data, text)
    const qrImagepath = path.join( __dirname,'../'+config.filesDir ) + 'qrcode/' + qrImageFilename

    QRCode.toFile(qrImagepath , text, {
      color: {
        dark: '#000',  // dots
        light: '#FFF' // Transparent background
      },
      width: 200
    })

    const qrData = {
      _id: data._id,
      destination: 'user/transactions/qrcode/',
      personalInfo: {
        firstname: data.firstname,
        lastname: data.lastname
      }
    }

    var file = {
      path: qrImagepath,
      filename: qrImageFilename
    }
    return new Promise(async (resolve, reject) => {
      return fileUploadtoCloud(file, qrData, false)
        .then(async uploadedFile => {
          return resolve(uploadedFile)
        })
        .catch(e => {
          logger(e)
          return reject(e)
        })
    })
  } catch (err) {
    console.error(err)
  }
}

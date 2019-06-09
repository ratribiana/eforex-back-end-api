'use strict'
import config from '../../config'
import {getStorage} from '../../config/firebase.js'
import multer from 'multer'

import {user} from 'model/user'

import {logger} from 'utils/logger'
import {createFileName} from 'utils/functions'

import path from 'path'
import fs from 'fs'
import dateFormat from 'dateformat'

const storage = multer.diskStorage({
	destination: ( req, file, cb ) => {
		cb( null, path.join( __dirname,'../'+config.filesDir ) )
	},
  filename: ( req, file, cb ) => {
		cb( null, dateFormat(new Date, 'yyyymmddHHMMss') + file.originalname )
	},
})

const fileFilter =  ( req, file, cb ) => {
  const   imageTypes = ["image/jpg", "image/jpeg", "image/JPG", "image/png", "image/gif"]
  if( file && imageTypes.indexOf(file.mimetype) < 0 ){
    cb(null, false)
  } else {
    cb(null, true)
  }
}

export const upload =  multer({
  storage: storage,
  limits: {fileSize: config.maxFileSize},
  fileFilter: fileFilter
})

export const fileUploadtoCloud = async (img, data, checkFile = true) => {
  return new Promise(async (resolve, reject) => {
      var newFilename = ''
      var newFilenamePath = ''

      if (checkFile) {
        const  imageTypes = ["image/jpg", "image/jpeg", "image/JPG", "image/png", "image/gif"]
        if( img && imageTypes.indexOf(img.mimetype) < 0 ){
          return reject('error_filetype')
          logger('error_filetype')
        }

        newFilename = img ? createFileName(data) : null
        newFilenamePath = img.destination + newFilename
        fs.renameSync( img.path, newFilenamePath );
      } else {
        newFilename = img.filename
        newFilenamePath = img.path
      }

    // console.log(newFilenamePath)
    // console.log(newFilename)
    // console.log(data.destination)
    // console.log(data._id)

    return getStorage().upload(newFilenamePath, { destination: data.destination + data._id + "/" + newFilename }, async (err, file) => {

      try {
        if (err) {
          return reject('error_uploading_file_in_firebase')
          logger('error_uploading_file_in_firebase')
        }

        if (file) {
          // getStorage.file(data.destination + data._id + "/" + data.verificationPhotoFilenameOld).delete();
          fs.unlinkSync(newFilenamePath)
        }

        var fileData = {
          cloudImageUrl: config.google_storage_url + data.destination + data._id + "/" + newFilename,
          localImageFileName: newFilename
        }
        // console.log('fileData', fileData)
        return resolve(fileData)
      } catch ( e ) {
        logger( e )
        return reject(e)
      }
          /*var updatData = {
            _id: data._id,
            IDType: data.idType,
          	IDNumber: data.idNumber,
            verificationImageFilenameOld: imageFilename,
            verificationImage: "https://storage.googleapis.com/zwappy-622e8.appspot.com/user/verification/photo/" + data._id + "/" + newFilename,
            KYCStatus: 'under_review',
            'document.submitted': new Date(),
            'document.documentType.IDType': data.idType,
            'document.documentType.IDNumber': data.IDNumber,
            'document.documentType.image': data.IDNumber,
            'document.overallStatus': 'under_review'
          }
          try {

            const updateUser = await user.updateUser(updatData)

          } catch ( e ) {
        		logger( e )
        		res.status( 400 ).send({error: 'error_updating_user_verification'})
        	}*/
      })

  })
}

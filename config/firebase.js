import * as firebaseAdmin from 'firebase-admin'
import {Storage} from '@google-cloud/storage'
const serviceAccount = 'config/firebase-key.json'

const config = {
    projectId: 'zwappy-622e8',
    keyFilename: serviceAccount
}

var gcs = new Storage(config)

firebaseAdmin.initializeApp({
  	credential: firebaseAdmin.credential.cert(serviceAccount),
  	databaseURL: "https://zwappy-622e8.firebaseio.com"
})

export const getDatabase = (name) => {
	const db = firebaseAdmin.database()
	const ref = db.ref(name)
  return ref
}

export const getStorage = () => {
  const storage = gcs.bucket('zwappy-622e8.appspot.com')
  return storage
}

export const getMessagingAdmin = () => {
  return firebaseAdmin
}

export const firebase = {getDatabase, getStorage, firebaseAdmin}

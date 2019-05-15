'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose

const schema = new Schema({
	userID: {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	overallStatus: {
		type      : String,
		enum      : ['under_review','not_verified','verified','rejected'],
		default   : 'not_verified',
		index     : true,
		searchable: true
	},
	proofOfID: {
		category: {
			type   : String,
			enum   : ['passport','nationalID','drivingLicense'],
			default: 'passport'
		},
		frontFilename: {
			type: String
		},
		backFilename: {
			type: String
		},
		status: {
			type   : String,
			default: null
		}
	},
	proofOfAddress: {
		filename: {
			type: String
		},
		status: {
			type   : String,
			default: null
		}
	},
	dateSubmitted: {
		type    : Date,
		required: true,
		default : Date.now
	},
	remarks: {
		type   : String,
		default: 'Please add remarks here'
	}
})

export class KYCDetailsClass {}

schema.loadClass( KYCDetailsClass )
export const KYC = mongoose.model( 'KYCDetails', schema )

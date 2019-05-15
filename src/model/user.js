'use strict'
import mongoose from 'mongoose'
import config from '../../config'
import {EventEmitter} from 'events'
import {hash, isValidPassword} from 'utils/passwords'
import sanitize from 'mongo-sanitize'

mongoose.plugin( require( 'mongoose-regex-search' ) )

export const  PASSWORD_SALT = config.secret
const {Schema} = mongoose
const e = new EventEmitter()

const schema = new Schema({
	username: {
		type      : String,
		required  : false,
		unique    : 'username_already_registered',
		index     : true,
		searchable: true
	},
	password: {
		type    : String,
		required: false
	},
	transactionPassword: {
		type    : String
	},
	totalCashBalance: {
		type   : Number,
		default: 0
	},
	email: {
		type      : String,
		required  : true,
		unique    : 'email_already_registered',
		index     : true,
		searchable: true
	},
	mobile: {
		type      : String,
		index     : true,
		required  : true,
		unique    : 'mobile_already_registered',
		searchable: true
	},
	photo: {
		fileName: {
			type   : String,
			default: null
		}
	},
	personalInfo: new Schema({
		firstname: {
			type      : String,
			index     : true,
			searchable: true,
			required: true,
			default   : ''
		},
		lastname: {
			type      : String,
			index     : true,
			searchable: true,
			required: true,
			default   : ''
		},
		gender: {
			type   : String,
			default: ''
		},
		dateOfBirth: {
			type   : Date,
			default: null
		}
	}),
	contactInfo: new Schema({
		addressLine1: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		},
		addressLine2: {
			type   : String,
			default: ''
		},
		zipCode: {
			type   : Number,
			default: 0
		},
		country: {
			type      : String,
			required  : true,
			index     : true,
			searchable: true,
			lowercase : true,
			default   : ''
		},
		state: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		},
		city: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		}
	}),
	registered: {
		type    : Date,
		required: true,
		default : Date.now
	},
	role: {
		roleID: {
			type: Schema.ObjectId,
			ref : 'Roles'
		},
		updatedBy: {
			type: Schema.ObjectId,
			ref : 'Users'
		},
		dateUpdated: {
			type   : Date,
			default: Date.now
		}
	},
	isDeleted: {
		type   : Boolean,
		default: false
	},
	isActive: {
		type   : Boolean,
		default: true
	},
	isAdmin: {
		type   : Boolean,
		default: false
	},
	isVerified: {
		type   : Boolean,
		default: false
	},
	verified: {
		type   : Date,
		default: null
	},
	isRejected: {
		type   : Boolean,
		default: false
	},
	lastLogin: {
		type   : Date,
		default: null
	},
	latestOtp: {
		type    : String,
		default : '',
	},
	IDType: {
		type    : String,
		default : '',
		required: true
	},
	IDNumber: {
		type    : String,
		default : '',
		required: true
	},
	security: {
		secret: {
			type   : String,
			default: null
		},
		tempSecret: {
			type   : String,
			default: null
		},
		reset2faByAdmin: {
			dateUpdated: {
				type: Date
			},
			adminID: {
				type: Schema.Types.ObjectId,
				ref : 'Users'
			},
			adminUsername: {
				type: String
			}
		}
	},
	acceptedTerms: {
		type   : Boolean,
		default: false
	},
	enableTour: {
		type   : Boolean,
		default: true
	},
	payoutBlocked: {
		blocked: {
			type   : Boolean,
			default: false
		},
		date: {
			type   : Date,
			default: null
		}
	},
	passwordResetByAdmin: {
		adminID: {
			type: Schema.Types.ObjectId,
			ref : 'Users'
		},
		adminUsername: {
			type: String
		},
		dateUpdated: {
			type: Date
		}
	},
	KYCStatus: {
		type      : String,
		enum      : ['under_review','not_verified','verified','rejected'],
		default   : 'not_verified',
		index     : true,
		searchable: true
	},
	document: new Schema({
		submitted: {
			type: Date
		},
		passport: new Schema({
			details: {
				type   : String,
				default: null
			},
			status: {
				type   : String,
				default: null
			}
		}),
		address: new Schema({
			details: {
				type   : String,
				default: null
			},
			status: {
				type   : String,
				default: null
			}
		}),
		status: new Schema({
			noIssue: {
				type   : Boolean,
				default: false
			},
			isMoreThanTreeAccounts: {
				type   : Boolean,
				default: false
			},
			isAddressDoesNotMatch: {
				type   : Boolean,
				default: false
			},
			isNoProfOfAdress: {
				type   : Boolean,
				default: false
			},
			isNameDoesNotMatchDocuments: {
				type   : Boolean,
				default: false
			},
			isNoPhotoID: {
				type   : Boolean,
				default: false
			},
			isUnclearPhotoID: {
				type   : Boolean,
				default: false
			},
			isUnclearAddress: {
				type   : Boolean,
				default: false
			},
			hasProfilePhoto: {
				type   : Boolean,
				default: false
			},
			isBirthDateMatchDocuments: {
				type   : Boolean,
				default: false
			},
			isNotOnApprovedList: {
				type   : Boolean,
				default: false
			},
			other: {
				type   : Boolean,
				default: false
			}
		}),
		remarks: {
			type   : String,
			default: 'Please add remarks here'
		},
		overallStatus: {
			type      : String,
			enum      : ['under_review','not_verified','verified','rejected'],
			default   : 'not_verified',
			index     : true,
			searchable: true
		}
	}),
	adminCreatedBy: {
		userID: {
			type: Schema.ObjectId,
			ref : 'Users'
		}
	}
})

const checkIfEmail = ( email ) => {
	var pattern = /\S+@\S+\.\S+/
	return pattern.test( email )
}

export class UserClass {
	static async login ( identifier, password ) {
		const creds = checkIfEmail( identifier ) ? {email: identifier} : {username: identifier}

		const user = await this.findOne({
			...creds,
			password : hash( password, PASSWORD_SALT )
		}).exec()

		if ( user ) {
			if ( !user.verified ) {
				return {user, error: 'account_not_verified'}
			} else {
				return user
			}
		} else {
			throw new Error( 'invalid_credentials' )
		}
	}

	static async register ( user ) {
		const userData = {}
		const created = await this.create(
			Object.assign( userData, user, {
				password           : user.password && hash( user.password, PASSWORD_SALT ),
				transactionPassword: user.transactionPassword && hash( user.transactionPassword, PASSWORD_SALT )
			})
		)
		return created
	}

	static async changePassword ( _id, password, newPassword ) {
		const oldPassword = hash( password, PASSWORD_SALT )
		const newerPassword = hash( newPassword, PASSWORD_SALT )
		if ( oldPassword == newerPassword ) {
			return {error: 'error_same_password'}
		}
		return this.findOneAndUpdate(
			{
				_id,
				password: oldPassword
			},
			{password: newerPassword},
			{new: true}
		).exec()
	}

	static updateUser ( user ) {
		const update = {...user}
		if ( update.password ) {
			if ( !isValidPassword( update.password ) ) {
				throw new Error( 'invalid_password' )
			}
			update.password = hash( update.password, PASSWORD_SALT )
		}

		return this.findOneAndUpdate(
			{
				_id: update._id
			},
			update,
			{new: true}
		).exec()
	}

	static updatePassword ( _id, password, currentPassword ) {
		if ( hash( password, PASSWORD_SALT ) == currentPassword ) {
			return false
		}
		return this.findOneAndUpdate(
			{
				_id
			},
			{password: hash( password, PASSWORD_SALT ), lastLogin: Date.now()},
			{new: true}
		).exec()
	}

	static async validateTransactionPassword ( _id, password ) {
		const verified = await this.findOne({
			_id,
			transactionPassword: hash( password, PASSWORD_SALT ),
			isDeleted          : false
		})
		if ( verified ){
			return verified
		} else {
			throw new Error( 'invalid_credentials' )
		}
	}

	static async changeTransactionPassword ( _id, newPincode ) {
		return this.findOneAndUpdate(
		  {_id},
		  {transactionPassword: hash( newPincode, PASSWORD_SALT )},
		  {new: true}
		).exec()
	}
}
schema.loadClass( UserClass )

export const castUserId = ( userId ) => mongoose.Types.ObjectId( userId )
export const user = mongoose.model( 'Users', schema )

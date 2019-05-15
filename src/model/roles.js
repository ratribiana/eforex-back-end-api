'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose

const labelAndStatus = {
	label: {
		type   : String,
		default: ''
	},
	isChecked: {
		type   : Boolean,
		default: false
	},
	view: {
		type   : Boolean,
		default: false
	},
	create: {
		type   : Boolean,
		default: false
	},
	update: {
		type   : Boolean,
		default: false
	},
	remove: {
		type   : Boolean,
		default: false
	}
}

const labelAndStatusWithNoDefault = {
	label: {
		type: String
	},
	isChecked: {
		type: Boolean
	},
	view: {
		type: Boolean
	},
	create: {
		type: Boolean
	},
	update: {
		type: Boolean
	},
	remove: {
		type: Boolean
	}
}

const schema = new Schema({
	name: {
		type    : String,
		required: true,
		unique 	: true
	},
	isDeleted: {
		type   : Boolean,
		default: false
	},
	rolePermissions: {
		createAdmin       : labelAndStatus ,
		userProfile       : labelAndStatus ,
		userSearch        : labelAndStatus ,
		activateDeactivate: labelAndStatus ,
		disable2FA        : labelAndStatus ,
		fundTransfer      : labelAndStatus ,
		countrySettings   : labelAndStatus ,
		resetPassword     : labelAndStatus ,
		roles       			: labelAndStatus,
		setUserRole    		: labelAndStatus,
		dashboard        : labelAndStatusWithNoDefault ,
		profile           : labelAndStatusWithNoDefault ,
		documents         : labelAndStatusWithNoDefault ,
		validation        : labelAndStatusWithNoDefault ,
		changePassword    : labelAndStatusWithNoDefault ,
		search            : labelAndStatusWithNoDefault ,
		changeTransactionPassword: labelAndStatusWithNoDefault,
 		siteInformation       : labelAndStatusWithNoDefault ,
		siteMentainanceMode   : labelAndStatusWithNoDefault ,
		supportEmail        		: labelAndStatusWithNoDefault ,
		promotionManagement   : labelAndStatusWithNoDefault ,
		emailNotifications    : labelAndStatusWithNoDefault ,
		addUserRoles         : labelAndStatusWithNoDefault ,
		loginPassword      : labelAndStatusWithNoDefault ,
		transactionPassword: labelAndStatusWithNoDefault
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	dateCreated: {
		type    : Date,
		required: true,
		default : Date.now
	},
	lastUpdatedBy: {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	dateUpdated: {
		type: Date
	},
	deletedBy: {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	dateDeleted: {
		type: Date
	}
})

export class roleClass {}

schema.loadClass( roleClass )

export const roles = mongoose.model( 'Roles', schema )

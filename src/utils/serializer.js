'use strict'
export const registerSerializer = ( register ) => ({
	username           : register.username,
	password           : register.password,
	transactionPassword: register.transactionPassword,
	email              : register.email,
	personalInfo: {
		firstname: register.firstname,
		lastname : register.lastname,
	},
	verified		 : register.verified
})

export const registerGuestSerializer = ( register ) => ({
	username    : register.username,
	password    : register.password,
	email       : register.email,
	mobile      : register.mobile,
	personalInfo: {
		firstname : register.firstname,
		lastname  : register.lastname,
	},
	IDType      : register.idType,
	IDNumber    : register.idNumber
})

export const userSearchSerializer = ( user ) => ({
	_id    			 : user._id,
	username   : user.username,
	email      : user.email,
	firstName    : user.personalInfo && user.personalInfo.firstname,
	lastName     : user.personalInfo && user.personalInfo.lastname,
	status       : user.isActive,
	registered   : user.registered,
	verified		 : user.verified
})

export const profileSerializer = ( profile ) => ({
	_id                      : profile._id,
	username                 : profile.username,
	email                    : profile.email,
	registered               : profile.registered,
	verified                 : profile.verified,
	personalInfo: {
		firstname  						 : profile.personalInfo && profile.personalInfo.firstname,
		lastname   						 : profile.personalInfo && profile.personalInfo.lastname
	},
	wallet: {
		cashBalance  					 : profile.cashBalance
	},
	status          				 : profile.isActive
})

export const nonAdminProfileSerializer = ( profile ) => ({
	_id                      : profile._id,
	username                 : profile.username,
	email                    : profile.email,
	registered               : profile.registered,
	verified                 : profile.verified,
	personalInfo: {
		firstname  						 : profile.personalInfo && profile.personalInfo.firstname,
		lastname   						 : profile.personalInfo && profile.personalInfo.lastname
	},
	wallet: {
		cashBalance  					 : profile.cashBalance
	},
	status          				 : profile.isActive
})

export const transactionSerializer = ( transaction ) => ({
	userID					  : transaction.userID,
	transactionID		  : transaction.transactionID,
	merchantCode			: transaction.merchantCode,
	ipAddress				  : transaction.ipAddress,
	amount					  : transaction.amount,
	baseCurrency      : transaction.baseCurrency,
  convertedAmount   : transaction.convertedAmount,
  convertToCurrency : transaction.convertToCurrency,
  exchangeRate      : transaction.exchangeRate
})

export const merchantSerializer = ( merchant ) => ({
	merchantCode	  : merchant.merchantCode,
	// userID		      : merchant.userID || '',
	merchantName		: merchant.merchantName,
	address: {
		addressLine1  : merchant.address && merchant.address.addressLine1,
		addressLine2  : merchant.address && merchant.address.addressLine2 || '',
		zipCode       : merchant.address && merchant.address.zipCode,
		country       : merchant.address && merchant.address.country,
		state         : merchant.address && merchant.address.state,
		city          : merchant.address && merchant.address.city
	},
	countryCode     : merchant.countryCode,
	stateCode       : merchant.stateCode,
	cityCode        : merchant.cityCode,
	// parentMerchant	: merchant.parentMerchant || '',
	// adminCreatedBy  : merchant.created_by || ''
})

export const walletSerializer = ( wallet ) => ({
	balance					: wallet.balance,
	walletAddress		: wallet.walletAddress,
	label						: wallet.label,
	userID					: wallet.userID
})

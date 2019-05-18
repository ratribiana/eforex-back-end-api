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
	email       : register.email,
	mobile      : register.mobile,
	personalInfo: {
		firstname : register.firstname,
		lastname  : register.lastname,
	},
	IDType      : register.idType,
	IDNumber    : register.idNumber,
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

export const walletSerializer = ( wallet ) => ({
	balance					: wallet.balance,
	walletAddress		: wallet.walletAddress,
	label						: wallet.label,
	userID					: wallet.userID
})

'use strict'
import config from '../../config'
import {logger} from 'utils/logger'
import hotp from 'otplib/hotp'
import totp from 'otplib/totp'
import authenticator from 'otplib/authenticator'
import crypto from 'crypto'
import dateformat from 'dateformat'

import {user} from 'model/user'

authenticator.options = { crypto }
hotp.options = { crypto }
totp.options = { crypto }

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const PINCODE_REGEX = /^\d{5}$/
const OTP_REGEX = /^\d{6}$/

export const isValidPassword = ( password ) => {
	return PASSWORD_REGEX.test( password )
}

export const isValidPinCode = ( pincode ) => {
	return PINCODE_REGEX.test( pincode )
}

export const hash = ( str, salt ) => {
	let hash = crypto.createHash( 'sha256' ).update( str )
	if ( salt ) {
		hash = hash.update( salt )
	}
	return hash.digest( 'hex' )
}

export const generatePassword = ( email, salt ) => {
	return `${hash( email, salt ).substring( 10, 18 )}1a`
}

export const generateOTP = () => {
	authenticator.options = {
	  step: 600,
	  window: 1,
		integer: 6,
		algorithm: 'sha256'
	}

	return authenticator.generate(config.otpSecret)
}

export const verifyOTPOtplib = (otp) => {
	const secret = config.otpSecret
	try {
		const isValid = authenticator.verify({ otp, secret })
		return isValid
	} catch (e) {
		return e
	}
}

export const verifyOTP = async (search) => {
	const userOTP = await user.getLastOTP(search)
	console.log(dateformat(new Date(userOTP.valid_until), "dd mm yyyy, h:MM:ss TT"))
	console.log(dateformat(new Date(), "dd mm yyyy, h:MM:ss TT"))
	return new Date(userOTP.valid_until) >= new Date()
}

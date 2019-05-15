'use strict'
import {user} from 'model/user'
import {decoder} from 'utils/jwt'
import {logger} from 'utils/logger'
import config from '../../config'
export const validateRole = ( rolePermissions , authorizedRole, length, currentRoleIndex=0 ) => {
	const currentRolePermission = rolePermissions[ authorizedRole[ currentRoleIndex ] ]
	if ( currentRolePermission == undefined ) {
		throw new Error( config.errorUnAuthorized )
	}
	if ( currentRolePermission.isChecked == false ) {
		throw new Error( config.errorUnAuthorized )
	}
	rolePermissions = currentRolePermission
	currentRoleIndex++
	if ( currentRoleIndex !=length ) {
		return validateRole( rolePermissions , authorizedRole, length, currentRoleIndex )
	} else {
		return true
	}
}

export const authorizer = ( authorizedRole = 'basic' ) => authorizer[ authorizedRole ] || ( authorizer[ authorizedRole ] = async ( req, res, next ) => {
	const token = req.header( 'authorization' )
	 try {
		const {_id, forgotPassword, is2FA} = decoder({secret: config.secret})( token )
		if ( is2FA ) {
			if ( !( await user.findOne({_id}).lean() ).security.secret ) {
				return res.status( 401 ).send({error: req.config.errorUnAuthorized})
			}
		}
		if ( forgotPassword ) {
			return res.status( 401 ).send({error: req.config.errorUnAuthorized})
		}
		req.session = {_id}
	} catch ( e ) {
		// logger( e )
		if (e.message === 'jwt expired') {
			return res.status( 400 ).send({error: 'session_expired'})
		} else {
			return res.status( 401 ).send({error: req.config.errorUnAuthorized})
		}
	}
	if ( authorizedRole == 'basic' ) {
		next()
	} else {
		res.status( 401 ).send({error: req.config.errorUnAuthorized})
	}
})

'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose

const schema = new Schema({
  userId: {
    type: Schema.ObjectId,
    ref : 'Users'
  },
	code: {
		type    : String,
		default : false,
		required: true
	},
	dateCreated: {
    type    : Date,
		required: true,
		default : Date.now
	}
})

export class OneTimePasswordClass {}

schema.loadClass( OneTimePasswordClass )

export const maintenance = mongoose.model( 'OneTimePassword', schema )

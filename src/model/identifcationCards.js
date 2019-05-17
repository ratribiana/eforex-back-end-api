'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose
mongoose.plugin( require( 'mongoose-regex-search' ) )

const schema = new Schema({
	idType: {
		type      : String,
		required  : true,
		index     : true,
    unique    : 'id_type_already_exists',
		searchable: true,
		lowercase : true
	},
  isDeleted: {
		type   : Boolean,
		default: true
	},
	isActive: {
		type   : Boolean,
		default: true
	}
})

export class DocumentTypesClass {
  static async saveDocumentType ( stateInfo ) {
    const created = await this.create( stateInfo )
    return created
  }

  static async getDocumentTypes ( countyCode ) {
    const documentTypes = await this.find({isActive: true}).sort({name: 'asc'}).exec()
    return documentTypes
  }

}

schema.loadClass( DocumentTypesClass )

export const state = mongoose.model( 'DocumentTypes', schema, 'DocumentTypes' )

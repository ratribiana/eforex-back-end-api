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

  static async getDocumentTypes ( ) {
    const documentTypes = await this.find({isActive: true}).sort({name: 'asc'}).exec()
    return documentTypes
  }

	static async getDocumentTypesLocal ( ) {
 		const idTypes = [
			{ idCode: 'PASSPORT', idType:'Passport', validIn: 'Philippines'},
			{ idCode: 'DRVRLS', idType:'Driver’s License', validIn: 'Philippines'},
			{ idCode: 'UMID', idType:'SSS Umid ID', validIn: 'Philippines'},
			{ idCode: 'SSSID', idType:'SSS ID', validIn: 'Philippines'},
			{ idCode: 'TINID', idType:'TIN ID', validIn: 'Philippines'},
			{ idCode: 'OFWID', idType:'OFW ID', validIn: 'Philippines'},
		]

    return idTypes
  }

}

schema.loadClass( DocumentTypesClass )

export const documentTypes = mongoose.model( 'DocumentTypes', schema, 'DocumentTypes' )

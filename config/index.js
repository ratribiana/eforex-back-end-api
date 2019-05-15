require('dotenv').config()
var config = require('12factor-config')

var cfg = config({
    host : {
        env      : 'APP_HOST',
        type     : 'string',
        default  : 'localhost',
        required : true,
    },
    port : {
        env      : 'APP_PORT',
        type     : 'integer',
        default  : '3000',
        required : true,
    },
    protocol : {
        env      : 'PROTOCOL',
        type     : 'string',
        default  : 'http',
        required : true,
    },
    dbHost : {
        env      : 'DB_HOST',
        type     : 'string',
        default  : 'ds151876.mlab.com',
        required : true,
    },
    dbPort : {
        env      : 'DB_PORT',
        type     : 'integer',
        default  : '51876',
        required : true,
    },
    dbUser : {
        env      : 'DB_USER',
        type     : 'string',
        default  : 'heroku_j6hqmbn0',
        required : true,
    },
    dbName : {
        env      : 'DB_NAME',
        type     : 'string',
        default  : 'heroku_j6hqmbn0',
        required : true,
    },
    dbPassword : {
        env      : 'DB_PASSWORD',
        type     : 'string',
        default  : 'o57hrju3g5n4ug16j6rmgmreq1',
        required : true,
    },
    debugMode : {
        env      : 'APP_DEBUG',
        type     : 'boolean',
        default  : true,
        required : true,
    },
    secret : {
        env      : 'SECRET',
        type     : 'string',
        default  : '99294354d37032fe545s37dc2dd3379e1d',
        required : true,
    },
    verifierSecret : {
        env      : 'VERIfIER_SECRET',
        type     : 'string',
        default  : '99294186737032fedadsca13fsdfhfdhfj',
        required : true,
    },
    feDomain : {
        env      : 'FE_DOMAIN',
        type     : 'string',
        default  : 'localhost',
        required : true,
    },
    maxSuggetions : {
        env      : 'MAX_SUGGESTIONS',
        type     : 'integer',
        default  : 10,
        required : true,
    },
    filesDir : {
        env      : 'IMAGES_DIR',
        type     : 'string',
        default  : './public/files/',
        required : true
    },
    maxFileSize : {
        env      : 'MAX_FILE_SIZE',
        type     : 'integer',
        default  : 10000000,
        required : true
    },
    maxImageUpload : {
        env      : 'MAX_IMAGE_UPLOAD',
        type     : 'integer',
        default  : 12,
        required : true
    },
    maxReadBytes : {
        env      : 'MAX_READ_BYTES',
        type     : 'integer',
        default  : 8200,
        required : true
    },
    errorUnAuthorized : {
        env      : 'ERROR_UNAUTHORIZED',
        type     : 'string',
        default  : 'error_unauthorized',
        required : true
    },
    companyName : {
        env      : 'COMPANY_NAME',
        type     : 'string',
        default  : 'Zwap',
        required : true,
    },
    companyAddress : {
        env      : 'COMPANY_ADDRESS',
        type     : 'string',
        default  : 'Dela Paz Pasig City',
        required : true,
    },
    companyEmail : {
        env      : 'COMPANY_EMAIL',
        type     : 'string',
        default  : 'ratribiana@gmail.com',
        required : true,
    },
    companyPhone : {
        env      : 'COMPANY_PHONE',
        type     : 'string',
        default  : '+639156914381',
        required : true,
    },
    env : {
      env      : 'NODE_ENV',
      type     : 'enum',
      default  : 'development',
      values   : ['development', 'production', 'test'],
    },
})

module.exports = cfg

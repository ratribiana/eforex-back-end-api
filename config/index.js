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
    otpSecret : {
        env      : 'OTP_SECRET',
        type     : 'string',
        default  : 'EFKSJEJDNZXSZNEKUSNHDGCQARJKCNSHFE',
        required : true,
    },
    feDomain : {
        env      : 'FE_DOMAIN',
        type     : 'string',
        default  : 'http://zwap.herokuapp.com',
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
    companyMobile : {
        env      : 'COMPANY_MOBILE',
        type     : 'string',
        default  : '+639156914381',
        required : true,
    },
    sendgrid_api_key : {
      env      : 'SENDGRID_API_KEY',
      type     : 'string',
      default  : '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',
      required : true
    },
    sendgrid_username : {
      env      : 'SENDGRID_USERNAME',
      type     : 'string',
      default  : 'ratribiana@gmail.com',
      required : true
    },
    sendgrid_password : {
      env      : 'SENDGRID_PASSWORD',
      type     : 'string',
      default  : 'CGIh-QwA.0S8jHeo',
      required : true
    },
    twilio_account_SID: {
      env      : 'TWILIO_ACCOUNT_SID',
      type     : 'string',
      default  : 'AC3d771c6cc3a387240bb5bf989d7ce379',
      required : true
    },
    twilio_auth_token: {
      env      : 'TWILIO_AUTH_TOKEN',
      type     : 'string',
      default  : '1ea70019c5bdbafdd0b93724238095c2',
      required : true
    },
    twilio_test_account_SID: {
      env      : 'TWILIO_TEST_ACCOUNT_SID',
      type     : 'string',
      default  : 'AC6cc384eac67de97eb35c05d1287153b0',
      required : true
    },
    twilio_test_auth_token: {
      env      : 'TWILIO_AUTH_TOKEN',
      type     : 'string',
      default  : 'e771c5425de1af92dde6b883f2437a53',
      required : true
    },
    nexmo_api_key: {
      env      : 'MEXMO_API_KEY',
      type     : 'string',
      default  : '963b9d02',
      required : true
    },
    nexmo_api_secret: {
      env      : 'NEXMO_API_SECRET',
      type     : 'string',
      default  : '6D1cnU10QZR7Qd8x',
      required : true
    },
    google_storage_url: {
      env      : 'GOOGLE_STORAGE_URL',
      type     : 'string',
      default  : 'https://storage.googleapis.com/zwappy-622e8.appspot.com/'
    },
    env : {
      env      : 'NODE_ENV',
      type     : 'enum',
      default  : 'development',
      values   : ['development', 'production', 'test'],
    },
})

module.exports = cfg

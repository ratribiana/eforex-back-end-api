'use strict'
import config from '../../config'
import twilio from 'twilio'
import Nexmo from 'nexmo'

export const createtwilioSMS = async (smsBody, receiverNumber) => {

  const client = new twilio(config.twilio_test_account_SID, config.twilio_test_auth_token)

  client.messages.create({
    body: smsBody,
    to: receiverNumber,
    from: config.companyPhone
  })
  .then(message => {
    console.log(message.sid)
  })
}

export const createSMS = async (smsBody, receiverNumber) => {

  const nexmo = new Nexmo({
    apiKey: config.nexmo_api_key,
    apiSecret: config.nexmo_api_secret
  })
  console.log(config.companyMobile)
  console.log(receiverNumber)
  const from = config.companyMobile
  const to = receiverNumber
  const text = smsBody

  nexmo.message.sendSms(from, to, text)
}

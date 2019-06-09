'use strict'
import config from '../../config'
import sendgrid from '@sendgrid/mail'
import helpers from '@sendgrid/helpers'


export const sendMail = async (data) => {
  sendgrid.setApiKey(config.sendgrid_api_key)

  const msg = {
    to: data.receiver_email,
    from: 'donotreply@zwappy.asia',
    subject: 'Welcome to Zwappy ' + data.firstname +' '+ data.lastname +' '+ data.suffix,
    html: data.html_content,
  }

	// msg.personalizations[0].to[0].bcc[0].email = 'ratribiana@gmail.com'

  sendgrid.send(msg)
}

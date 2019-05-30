'use strict'
import config from '../../config'

export const getMailTemplateGuestTransaction = (data) => {
  var social_media_icon = ''
  var downloadApp = ''

  // var verifyLink = 'http:localhost:3000/verify/' + data.token
  var verifyLink = config.feDomain + '/verify/' + data.token
  var html_content = '<span style="font-size:15px">Hi '+ data.firstname + ',</span>' +
    '<br />' +
    '<br /><span style="font-size:15px">Welcome to ' + config.companyName + '!</span>' +
    '<br />' +
    '<br />' +
    '<span style="font-size:15px">We created temporary username and password for you:</span>' +
    '<br />' +
    '<br />' +
    '<strong style="font-size:15px"> Username: '+ data.username +'</strong>' +
    '<br />' +
    '<strong style="font-size:15px"> Password: '+ data.password +'</strong>' +
    '<br />' +
    '<p style="font-size:15px">You can update them anytime once your email is already verified</p>' +
    '<table style="width:100%">'+
      '<tbody>'+
        '<tr><td style="font-size:15px">Please verify your email first by clicking the button below. <br/><br/><a href="'+ verifyLink +'" style="background-color:#5d92f4;padding:10px;color: #fff;text-decoration:none;border-radius:5px">Verify My Email</a></tr>' +
        '<tr>' +
          '<td style="font-size:15px">' +
            '<br />' +
            'Or use this link: <br/><a href="'+ verifyLink +'" >' + verifyLink + '</a>' +
          '</td>' +
        '</tr>' +
      '</tbody>'+
    '</table>';

    return html_content
 }

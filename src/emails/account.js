const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = process.env.SGAPIKEY

sgMail.setApiKey(sendgridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.MYEMAIL,
        subject: 'Thanks for joining us!',
        text: `Welcome to the app, ${name}. Let me know what you think of the app`
    })
}

const sendByeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: process.env.MYEMAIL,
        subject: 'Sorry to see you leaving :(',
        text: `We are sorry to see you leaving ${name}. Can you please let us know why you are leaving?`
    })
}

module.exports = { sendWelcomeEmail, sendByeEmail }
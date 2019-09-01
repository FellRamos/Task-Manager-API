const sgMail = require('@sendgrid/mail')

const sendgridAPIKey = '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'

sgMail.setApiKey(sendgridAPIKey)

sgMail.send({
    to: 'feliciano.ramos.pro@gmail.com',
    from: 'feliciano.ramos.pro@gmail.com',
    subject: 'This is my first email from node.js!',
    text: 'Some text here..'
})
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// async..await is not allowed in global scope, must use a wrapper
async function mailer(email, token) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    // port: 587,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL, // generated ethereal user
      pass: process.env.SMTP_PASSWORD // generated ethereal password
    }
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: 'Hypelearn 👻', // sender address
    to: email, // list of receivers
    subject: 'Password reset link for hypelearn', // Subject line
    text: 'Hey learner forgot your password⁉ No worries please click below link to reset your passwords.', // plain text body
    html: `<div>Hey learner forgot your password⁉ No worries please click below link to reset your passwords.✏️</div><b> http://localhost:3000/reset-password/${token}</b> `// html body
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

module.exports = { mailer };

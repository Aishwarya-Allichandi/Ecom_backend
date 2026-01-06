const nodemailer = require('nodemailer');
require('dotenv').config(); 


// Gmail SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.GMAIL_USER, 
    pass: process.env.GMAIL_APP_PASSWORD 
  }
});

// Email configuration process
const mailOptions = {
  from: process.env.GMAIL_USER,
    to: '', 
  subject: 'Test Email from Gmail',
  text: 'Hello! This is a test email sent through Gmail using Nodemailer.',
  html: `
    <h2>Hello !!!!!</h2>
  `
};

console.log('📧 Sending email...');

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('❌ Error occurred:', error.message);
  } else {
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  }
});
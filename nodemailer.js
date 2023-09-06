const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail', // e.g., 'Gmail', 'Outlook'
    auth: {
        user: 'nodejs791@gmail.com',
        pass: 'jazw dcde dlfy pugs',
    },
});

module.exports = transporter;

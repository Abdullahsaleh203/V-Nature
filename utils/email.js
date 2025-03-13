// Description: This file contains the code to send an email using nodemailer.
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    try {
        // 1) Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

            // 2) Define the email options
            const mailOptions = {
            from: process.env.EMAIL_USERNAME, // This is the email that will be shown as the sender
            to: options.email,
            subject: options.subject,
            text: options.message
        };

// 3) Actually send the email
        console.log('Send to:', options.email);

        await transporter.sendMail(mailOptions);
        console.log('Successfully sent email!');
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email:', error);
    }
};

module.exports = sendEmail;

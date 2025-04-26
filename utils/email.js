// Description: This file contains the code to send an email using nodemailer.
const pug = require('pug');
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstname = user.name.split(' ')[0];
        this.url = url;
        this.from = `V-Natural <${process.env.EMAIL_FROM}>`;
    }
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
            return ;
            // return nodemailer.createTransport({
            //     service: 'SendGrid',
            //     auth: {
            //         user: process.env.SENDGRID_USERNAME,
            //         pass: process.env.SENDGRID_PASSWORD
            //     }
            // });
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }
    // Send the actual email
    async send(template, subject) {
        // 1) Render HTML based on a pug template
        const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
            firstname: this.firstname,
            url: this.url,
            subject
        });
        // 2) define email options
        const mailOptions = {
            from: this.from, // This is the email that will be shown as the sender
            to: this.to,
            subject,
            html,
            text: htmlToText.convert(html)
        };
        await this.newTransport().sendMail(mailOptions)
    }
    // 3) Create a transport and send email
    async sendWelcome() {
        await this.send('welcome', 'Welcome to the V-Natural Family!');
    }
    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for only 10 minutes)');
    }
}

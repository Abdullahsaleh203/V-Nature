// const nodemailer = require('nodemailer');

// const sendEmail = async options => {
//     // 1) Create a transporter
//     const transporter = nodemailer.createTransport({
//         host: process.env.EMAIL_HOST,
//         port: process.env.EMAIL_PORT,
//         auth: {
//             user: process.env.EMAIL_USERNAME,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     })
//     // 2) Define the email options
//     const mailOptions = {
//       from: process.env.EMAIL_USERNAME,
//       to: options.email,
//       subject: options.subject,
//       text: options.message
//   };
//     // 3) Actually send the email
//     await transporter.sendMail(mailOptions);
//     };

// module.exports = sendEmail;
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    try {
        // 1) إنشاء ناقل
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        // 2) تحديد خيارات البريد (مبسطة)
        const mailOptions = {
            from: process.env.EMAIL_USERNAME, // استخدام عنوان البريد المعتمد
            to: options.email,
            subject: options.subject,
            text: options.message
            // يمكنك إضافة html و attachments لاحقًا بعد الاختبار
        };

        // 3) التحقق من عنوان المستقبل
        console.log('عنوان المستقبل:', options.email);

        // 4) إرسال البريد
        await transporter.sendMail(mailOptions);
        console.log('تم إرسال البريد بنجاح');
    } catch (error) {
        console.error('خطأ في إرسال البريد:', error);
        throw new Error('حدث خطأ أثناء إرسال البريد الإلكتروني. حاول مرة أخرى لاحقًا!');
    }
};

module.exports = sendEmail;

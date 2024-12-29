const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
    timeout: 30000, 
    tls: {
      rejectUnauthorized: false
    }
  });

  // 2) Define the email options
  const mailOptions = {
    from: 'Farah Mahfouz <farahmahfouz11@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html,
  };
  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};


module.exports = sendEmail;

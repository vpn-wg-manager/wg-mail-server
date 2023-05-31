require("dotenv").config();
const nodemailer = require('nodemailer');

const main = async () => {
  const {
    MAIL_HOST,
    MAIL_USER,
    MAIL_PASS
  } = process.env

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS
    }
  });



  // transporter.verify(function (error, success) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });
  return transporter;
}

module.exports = {
  main
}

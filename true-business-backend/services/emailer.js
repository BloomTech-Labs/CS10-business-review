const crypto = require("crypto");
const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.REACT_APP_SENDGRID_API_KEY
  })
);

const generateSignupKey = () => {
  const buf = crypto.randomBytes(24);
  const created = Date.now();

  return {
    key: buf.toString("hex"),
    ts: created,
    exp: created + 86400000
  };
};

const sendEmail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    transport.sendMail(
      {
        from: "True Business Review <truebusinessreviews@gmail.com>",
        to,
        subject,
        html
      },
      (err, info) => {
        if (err) reject(err);
        resolve(info);
      }
    );
  });
};

module.exports = { generateSignupKey, sendEmail };

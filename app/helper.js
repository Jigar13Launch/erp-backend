const setting_detail = {is_use_aws_bucket: false}
const fs = require("fs");
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
var axios = require("axios");
const CRYPTO_ENCRIPTION_KEY = "oNLinE-naNaLAl-32-CryPTO-16-EnC-KEY"
const nodemailer = require('nodemailer');

exports.generateRandomNumber = (length) => {
  return "" + Math.floor((10 ** (length-1)) + Math.random() * (9 * 10 ** (length-1)))
}

exports.createAuthToken = async (adminId) => {
  var jwt_token = await jwt.sign({_id:adminId}, process.env.JWT_SECRET_KEY,{ expiresIn: '24h' });
  return jwt_token;
}
exports.encryptPassword = async function(password){
  var ciphertext = CryptoJS.AES.encrypt(password, CRYPTO_ENCRIPTION_KEY).toString();
  return ciphertext;
}
exports.decryptPassword = async function(password){
  var bytes = CryptoJS.AES.decrypt(password, CRYPTO_ENCRIPTION_KEY);
  var originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}

exports.lastTwoDigitCurrentYear = () => {
  return `${new Date().getFullYear().toString().slice(-2)}`
}

exports.sendOtpSms = async(email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jaylaunchpad1@gmail.com',
      pass: 'wlcbectdqclthmba',
    },
  });
  
  const mailOptions = {
    from: 'jaylaunchpad1@gmail.com',
    to: email,
    subject: 'Email Verification',
    text: `Your OTP is: ${otp}`,
  };

  transporter.sendMail(mailOptions);
};
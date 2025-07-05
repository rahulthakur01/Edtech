const mongoose = require('mongoose');
const nodemailer = require('../utils/mailSender');

const OTPschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: 5 * 60,
    }
});


// function call to send mail
async function sendVerificationMail(email, otp) {
    try {
        const mailRes = nodemailer.sendMail(email, "Verification email from Rajendra", otp)
        console.log("Email sent successfully", mailRes);
    } catch (error) {
        console.log("Error occure while sending email", error);
    }
}
OTPschema.pre("save", async function (next) {
    await sendVerificationMail(this.email, this.otp);
    next();
})

module.exports = mongoose.model("OTP", OTPschema);

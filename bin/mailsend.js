const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require('path')
require('dotenv').config(path.join(__dirname, "../.env"))

const urlToSend = "https://dazzling-chandrasekhar-1ace87.netlify.app"



async function welcomeMail(user) {

    const mailToUser = {
        from: "sariokay@yahoo.com",
        to: user.email,
        subject: `Welcome ${user.firstname}. Tasty Pizza Awaiting you`,
        replyTo: "sariokay@yahoo.com",
        text: `Dear ${user.firstname, ' ', user.secondName}, we are glad to have you onboard.`,
        html: `<p>Dear ${user.firstname}, we are glad to have you onboard. We believe in serving fresh Pizza right from our oven to your door<br>` +
            `<br><br> </p>` +
            `Plus we guarantee delivery in less than 30 mins. So what are you waiting for. Click the following button and lets get started` +
            `<a href = "${urlToSend}"> <button style="display: inline-block; background-color: rgb(26, 22, 224); color: white; height: 36px; border: transparent solid; border-radius: 5px; padding: 5px;" >Click Here</button> </a>` +
            `<br><br> This is a system generated mail. Please dont reply to it`
    };

    const mailToAdmin = {
        from: "sariokay@yahoo.com",
        to: "anunay.sinha.mec09@iitbhu.ac.in",
        subject: `A new user - ${user.name} - has just been on board.`,
        replyTo: "sariokay@yahoo.com",
        text: `A new user with username - ${user.name} and email - ${user.email} has joined us.`,
        html: `<p>A new user with username - ${user.name} and email - ${user.email} has joined us.</p>` +
            `This is FYI`
    };

    const transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: "sariokay@yahoo.com",
            pass: 'wfexyufcsvonksvf'
        }
    });

    await transporter.sendMail(mailToUser)
    await transporter.sendMail(mailToAdmin)
}


async function problemSigningIn(user, randString) {

    const mailToUser = {
        from: "sariokay@yahoo.com",
        to: user.email,
        subject: `Password reset link`,
        replyTo: "sariokay@yahoo.com",
        text: `Dear ${user.firstname}, you or someone requested to reset your password.` +
            `If it were not you kindly contact the admin. If it were you, you may click the following link and reset your password. URL is ${urlToSend}`,
        html: `<p>Dear ${user.firstname}, you or someone requested to reset your password. If it were not you kindly contact the admin. If it were you, kindly note the string -- ${randString} <br>` +
            ` you should use it on the webpage to reset the password <br><br> </p>` +
            `<br><br> This is a system generated mail. Please dont reply to it`
    };

    const transporter = nodemailer.createTransport({
        service: 'yahoo',
        auth: {
            user: "sariokay@yahoo.com",
            pass: 'wfexyufcsvonksvf'
        }
    });

    await transporter.sendMail(mailToUser)

    console.log(user);
}

module.exports = { welcomeMail: welcomeMail, problemSigningIn: problemSigningIn };
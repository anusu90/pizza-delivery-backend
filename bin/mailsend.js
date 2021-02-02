const nodemailer = require("nodemailer");
const crypto = require("crypto");
const path = require('path')
require('dotenv').config(path.join(__dirname, "../.env"))

const urlToSend = "http://localhost:3002/users"



async function welcomeMail(user) {

    const mailToUser = {
        from: "sariokay@yahoo.com",
        to: user.email,
        subject: `Welcome ${user.firstname}. Tasty Pizza Awaiting you`,
        replyTo: "sariokay@yahoo.com",
        text: `Dear ${user.firstname, ' ', user.secondName}, we are glad to have you onboard.`,
        html: `<p>Dear ${user.name}, we are glad to have you onboard. We believe in serving fresh Pizza right from our oven to your door<br>` +
            ` or you may also click the following buttom: <br><br> </p>` +
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

    let dtnow = Date.now()
    // console.log(dtnow, Date.now(), Date.now() - dtnow);

    let urlToSend = backendURL + "/resetpassword/" + 'user=' + user.email + '&randKey=' + randString + "&dtNow=" + dtnow;

    const mailToUser = {
        from: "sariokay@yahoo.com",
        to: user.email,
        subject: `Password reset link`,
        replyTo: "sariokay@yahoo.com",
        text: `Dear ${user.name}, you or someone requested to reset your password.` +
            `If it were not you kindly contact the admin. If it were you, you may click the following link and reset your password. URL is ${urlToSend}`,
        html: `<p>Dear ${user.name}, you or someone requested to reset your password. If it were not you kindly contact the admin. If it were you, you may click the following link and reset your password.<br><br> URL is ${urlToSend} <br>` +
            ` or you may also click the following buttom: <br><br> </p>` +
            `<a href = "${urlToSend}"> <button style="display: inline-block; background-color: rgb(26, 22, 224); color: white; height: 36px; border: transparent solid; border-radius: 5px; padding: 5px;" >Click Here</button> </a>` +
            `<br><br> This is a system generated mail. Please dont reply to it`
    };
    console.log(user);
}

module.exports = { welcomeMail: welcomeMail, problemSigningIn: problemSigningIn };
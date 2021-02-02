var express = require('express');
var router = express.Router();
const path = require('path');
var mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
require('dotenv').config(path.join(__dirname, "../.env"))
const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const jwt = require('jsonwebtoken');
var cookie = require('cookie');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//MAIL SEND FEATURE

let mailSendPath = "../bin/mailsend.js"
let { welcomeMail, problemSigningIn } = require(mailSendPath)


/////////LOGIN BACKEND/////////////

router.post("/login", async (req, res) => {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userDBCollection = client.db('pizza-shop').collection("users");
    let user = await userDBCollection.findOne({
      email: req.body.email
    });

    if (user) {
      let compare = await bcrypt.compare(req.body.password, user.password);
      if (compare === true) {
        let token = jwt.sign({ user: user }, process.env.RANDOM_KEY_FOR_JWT, { expiresIn: 120 })
        res.setHeader('Set-Cookie', cookie.serialize('myAgainJwt2', token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7, // 1 week,
          sameSite: "none",
          secure: true
        }));
        res.status(200).json(user);
      } else {
        res.status(401).json({
          "message": "Invalid password"
        })
      }
    } else {
      res.status(401).json({
        "message": "Invalid user or Inactive user"
      })

    }

    await client.close();

  } catch (error) {

    res.status(500).json({
      "message": error
    })
  }
})


router.post("/register", async (req, res) => {

  try {

    console.log(req.body);

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userDBCollection = client.db('pizza-shop').collection("users");
    let user = await userDBCollection.findOne({
      email: req.body.email
    });

    if (user) {
      res.status(404).json({
        "message": "the email address already exists please go through forgot password"
      })
    } else {

      let salt = await bcrypt.genSalt(10)
      let hashedPass = await bcrypt.hash(req.body.password, salt);
      req.body.password = hashedPass;
      let input = await userDBCollection.insertOne(req.body);

      await client.close();

      if (input.insertedCount === 1) {
        welcomeMail(req.body);
        res.status(200).json({
          "message": "user inserted"
        })
      } else {
        res.status(404).json({
          "message": "User insertion failed"
        })
      }
    }

  } catch (error) {

    res.status(500).json({
      "message": error
    })

  }

})

module.exports = router; 

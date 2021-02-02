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


/////////LOGIN BACKEND/////////////

router.post("/login", (req, res) => {
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

module.exports = router; 

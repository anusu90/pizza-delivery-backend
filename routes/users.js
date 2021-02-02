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

/////////REGISTER BACKEND/////////////

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

/////////LOGOUT BACKEND/////////////
router.get("/logout", async (req, res) => {

  try {
    console.log(req.headers)
    res.setHeader('Set-Cookie', cookie.serialize('myAgainJwt2', "invalid-cookie", {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week,
      sameSite: "none",
      secure: true
    }));
    res.status(200).json({ message: "Logout Successful" })

  } catch (error) {

    res.status(500).json({ message: error })

  }


})

const myAuth = (req, res, next) => {

  if (req.headers.cookie) {

    try {
      let jwtToBeVerfied = req.headers.cookie.split('=')[1];
      let verifiedUser = jwt.verify(jwtToBeVerfied, process.env.RANDOM_KEY_FOR_JWT)
      req.body.userID = verifiedUser.user._id;
      console.log(verifiedUser.user._id);
      next();

    } catch (error) {
      res.status(404).json({ message: "Unauthorized Access" })
    }

  }

}

router.get("/check", myAuth, async (req, res) => {

  userID = req.body.userID;
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  let userDBCollection = client.db('pizza-shop').collection("users");
  let user = await userDBCollection.findOne({
    _id: mongodb.ObjectID(userID)
  });

  console.log(user);
  res.status(200).json(user)



})


//////FORGOT PASS/////////
router.post("/emailverify", async (req, res) => {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userDBCollection = client.db('pizza-shop').collection("users");

    let user = await userDBCollection.findOne({
      email: req.body.email
    });

    if (user) {
      let randKey = require('crypto').randomBytes(8).toString('hex');
      problemSigningIn(user, randKey);

      await userDBCollection.updateOne({
        email: req.body.email
      }, { $set: { randKey: randKey } });

      res.status(200).json({
        "message": "Email sent"
      })

    } else {
      res.status(404).json({
        "message": "No Email Found"
      })

    }

  } catch (error) {

    res.status(500).json({
      "message": error
    })

  }

})


router.post("/changepass", async (req, res) => {

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let userDBCollection = client.db('pizza-shop').collection("users");

    let user = await userDBCollection.findOne({
      email: req.body.email
    });

    if (user) {

      console.log(user)
      console.log(req.body.randKey)

      if (req.body.randKey == user.randKey) {
        let salt = await bcrypt.genSalt(10)
        let hashedPass = await bcrypt.hash(req.body.password, salt);
        await userDBCollection.updateOne({
          email: req.body.email
        }, { $set: { password: hashedPass } });

        res.status(200).json({
          "message": "Pass changed"
        })

      } else {
        res.status(404).json({ message: "Incorrect Random Key" })
      }

    } else {
      res.status(404).json({
        "message": "No Email Found"
      })

    }

  } catch (error) {

    res.status(500).json({
      "message": error
    })

  }

})



module.exports = router; 

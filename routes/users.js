var express = require('express');
var router = express.Router();
const path = require('path');
var mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const nodemailer = require("nodemailer");
require('dotenv').config(path.join(__dirname, "../.env"))
const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const jwt = require('jsonwebtoken')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


/////////LOGIN BACKEND/////////////

router.post("/login", (req, res) => {
  console.log()
})

module.exports = router; 

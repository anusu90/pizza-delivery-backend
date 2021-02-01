var express = require('express');
var router = express.Router();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, "../.env") })
const MongoClient = require('mongodb').MongoClient
const uri = `mongodb+srv://dBanusu90:${process.env.DB_PASS}@Cluster0.xudfg.mongodb.net/<dbname>?retryWrites=true&w=majority`;


/* GET home page. */
router.get('/readypizza', async function (req, res) {

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let readyPizzaCollection = client.db('pizza-shop').collection("readyPizza");
    let readyPizza = await readyPizzaCollection.find().toArray();
    res.status(200).json(readyPizza);

  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "Server encountered an Error" })

  }

});

module.exports = router;

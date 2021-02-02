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

router.get('/mypizzaitems', async function (req, res) {

  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    let crustCollection = client.db('pizza-shop').collection("crust");
    let crusts = await crustCollection.find().toArray();

    let meatCollection = client.db('pizza-shop').collection("meat");
    let meats = await meatCollection.find().toArray();

    let sauceCollection = client.db('pizza-shop').collection("sauce");
    let sauces = await sauceCollection.find().toArray();

    let veggyCollection = client.db('pizza-shop').collection("veggies");
    let veggies = await veggyCollection.find().toArray();

    res.status(200).json({ data: [crusts, meats, sauces, veggies] });

  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "Server encountered an Error" })

  }

});



module.exports = router;

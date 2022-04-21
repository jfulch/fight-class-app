// server.js file - this runs everything :)
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const res = require('express/lib/response');
//sets up mongo database connection
const MongoClient = require('mongodb').MongoClient;
//sets up .env file for sensative variables.
const dotenv = require('dotenv').config()
//sets connection string varaible in .env file
const connectionString = process.env.MONGO_STRING;

//Tells app to use ejs
app.set('view engine', 'ejs')
// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
//this allows me to use javascript and css files
app.use(express.static('public'))

app.listen(3000, function () {
  //not needed, just testing
  console.log('listening on 3000')
  //needed to .env variable logic
  require('dotenv').config()
})

//connects to DB, and does methods inside of DB
MongoClient.connect(connectionString, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('userDB')
  const classCollection = db.collection('classTracker')

  ///Navigates to Login Page
  app.get('/login', (req, res) => {
    console.log('login link')
    res.render('login')
  })
  ///Navigates to User Page
  app.get('/user', (req, res) => {
    console.log('user link')
    res.render('user')
  })

  //get data from db on class stats page
  app.get('/classStats', (req, res) => {
    //find all records, sort by date ascending
    classCollection.find().toArray()
      .then(results => {
        console.log(results)
        var x101Class = 0;
        var compClass = 0;
        var allLevclass = 0;
        for (var i = 0; i < results.length; i++) {
          if (results[i].className == "101") {
            x101Class = x101Class + 1
          } else if (results[i].className == "Competition") {
            compClass = compClass + 1
          } else if (results[i].className == "All Levels") {
            allLevclass = allLevclass + 1
          }
        }
        console.log('total calsses: ' + results.length)
        console.log('101 class count: ' + x101Class)
        console.log('Comp count: ' + compClass)
        console.log('All Levels class count: ' + allLevclass)

        res.render('classStats.ejs', {
          classTracker: results,
          x101Class: x101Class,
          compClass: compClass,
          allLevclass: allLevclass,
          totalClassCount: results.length
        })
      })
      .catch(error => console.error(error))

  })

  //get data for HOME/Index page
  app.get('/', (req, res) => {
    //find all records, sort by date ascending
    classCollection.find().sort({ classDate: 'asc' }).toArray()
      .then(results => {
        res.render('index.ejs', {
          classTracker: results
        })
      })
      .catch(error => console.error(error))
  })

  //post new record into class tracker
  app.post('/classTracker', (req, res) => {
    console.log(req.body)
    classCollection.insertOne(req.body)
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })

  //update existing record
  app.put('/classTracker', (req, res) => {
    console.log(req.body)
    classCollection.findOneAndUpdate({
      name: 'Yoda'
    }, {
      $set: {
        name: req.body.name,
        classNotes: req.body.classNotes
      }
    }, {
      upsert: true
    })
      .then(result => {
        res.json('Success')
        console.log(result)
      })
      .catch(error => console.error(error))
  })

  //delete a record
  app.delete('/classTracker', (req, res) => {
    classCollection.deleteOne({
      name: req.body.name
    })
      .then(result => {
        if (result.deletedCount === 0) {
          return res.json('No class record to delete')
        }
        res.json('Deleted Darth Vadar`s Class Record')
      })
      .catch(error => console.error(error))
  })

})

// server.js file - this runs everything :)
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const res = require('express/lib/response');
//references my tools js file
const tools = require('./public/js/tools');
//sets up mongo database connection
const MongoClient = require('mongodb').MongoClient;
//sets up .env file for sensative variables.
const dotenv = require('dotenv').config()
//sets connection string varaible in .env file
const connectionString = process.env.MONGO_STRING;

var passport = require('passport');
var LocalStrategy = require('passport-local');
var crypto = require('crypto');


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
  //navigates to register page
  app.get('/register', (req, res) => {
    console.log('register page')
    res.render('register')
  })
  ///Navigates to User Page
  app.get('/user', (req, res) => {
    console.log('user link')
    res.render('user')
  })

  //get data from db on class stats page
  app.get('/classStats', (req, res) => {
    classCollection.find().toArray()
      .then(results => {
        x101Class = tools.getClassesAttended(results, "101")
        compClass = tools.getClassesAttended(results, "Competition")
        allLevclass = tools.getClassesAttended(results, "All Levels")
        
        res.render('classStats.ejs', {
          x101Class: x101Class,
          compClass: compClass,
          allLevclass: allLevclass,
          totalClassCount: results.length
        })
      })
      .catch(error => console.error(error))
  })

  //API call on stat's page to get specific fighter stats
  app.get('/findFighterStats', (req, res) => {
    classCollection.find({name: req.query.fighter}).toArray().then(results => {
      x101Class = tools.getClassesAttended(results, "101")
      compClass = tools.getClassesAttended(results, "Competition")
      allLevclass = tools.getClassesAttended(results, "All Levels")
      
      res.render('classStats.ejs', {
        totalClassCount: results.length,
        x101Class: x101Class,
        compClass: compClass,
        allLevclass: allLevclass
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
        classNotes: req.body.classNotes,
        className: req.body.className,
        classDate: req.body.classDate
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

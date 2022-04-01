// server.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const connectionString = 'REMOVED';

//Tells app to use ejs
app.set('view engine', 'ejs')
// Make sure you place body-parser before your CRUD handlers!
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
//this allows me to use javascript and css files
app.use(express.static('public'))

app.listen(3000, function() {
  console.log('listening on 3000')
})

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
///Navigates to Index
app.get('/index', (req, res) => {
  console.log('index link')
  res.render('index')
})

//connects to DB, and does methods inside of DB
MongoClient.connect(connectionString, (err, client) => {
  if (err) return console.error(err)
  console.log('Connected to Database')
  const db = client.db('userDB')
  const classCollection = db.collection('classTracker')

  app.post('/classTracker', (req, res) => {
    console.log(req.body)
    classCollection.insertOne(req.body)
      .then(result => {
        console.log(result)
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })

  app.get('/', (req, res) => {
    db.collection('classTracker').find().toArray()
      .then(results => {
        res.render('index.ejs', {
          classTracker: results
        })
      })
      .catch(error => console.error(error))
  })

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

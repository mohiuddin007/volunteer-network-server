const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.l47bs.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const activitiesCollection = client.db(`${process.env.DB_NAME}`).collection("VolunteerActivities");
  const registerVolunteerCollection = client.db(`${process.env.DB_NAME}`).collection("VolunteerRegistration");


    app.get('/allActivity', (req, res) => {
      activitiesCollection.find({})
      .toArray( (err, documents) =>{
        res.send(documents)
      })
    })

    app.post('/newRegister', (req, res) =>{
      const registration = req.body;
      registerVolunteerCollection.insertOne(registration)
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result)
      })
    })

    app.get('/allVolunteerList', (req, res) => {
      registerVolunteerCollection.find({})
      .toArray( (err, documents) => {
        res.send(documents)
      })
    })

    app.post('/addEvent', (req, res) => {
      const event = req.body;
      activitiesCollection.insertOne(event)
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result.insertedCount);
      })
    })

    app.get('/specificVolunteer', (req, res) => {
      console.log(req.query.email);
      registerVolunteerCollection.find({email: req.query.email})
      .toArray( (err, documents) => {
        res.send(documents)
      })
    })

    app.delete('/deleteVolunteer/:id', (req, res) => {
      registerVolunteerCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then(result => {
        res.send(result.deletedCount > 0);
        console.log('delete successfully');
      })
    })
});


app.get('/', function (req, res) {
  res.send('hello world')
})

app.listen(8000)
require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

mongoose.connect(`mongodb://${process.env.DB_HOST}:27017/people`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're connected to mongo")
});

app.listen(process.env.APP_PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.APP_PORT}`)
})

const personSchema = new mongoose.Schema({
  id: String,
  name: String
});
const Person = mongoose.model("Person", personSchema)



app.get('/', (req, res) => {
  res.send('Testing')
})

app.get('/person/:id', (req, res) => {
  Person.find({id: req.params.id}, (err, doc) => {
     if(err) {
       res.send(err.message)
     }
     res.send(doc)
  })
})

app.post('/person/create', (req, res) => {
    const newPerson = new Person({
      id: req.body.id,
      name: req.body.name
    })

    newPerson.save((err) => {
      if(err) {
        res.send(err.message)
      }
      res.send("Saved successfully")
    })
})
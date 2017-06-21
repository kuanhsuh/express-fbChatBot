'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 5000))

// Allow us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.get('/', function(req, res) {
  res.send("Hi, I am a chatbot")
})

// FACEBOOK (security thing)
app.get('/webhook/', function(req, res) {
  // hub?
  if (req.query['hub.verify_token'] === "XXX") {
    res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})

app.listen(app.get('port'), function(){
  console.log('running: port')
})
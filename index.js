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

let token = "EAANUiOKJXm0BAK7P2xa3FqONbUTexxGdGAhNO6StjWATgRJBn3IZBHZB9mscgVpqj5YZB8gIBl6otZCNzCSiFd7w6C0ESxBmamOU0jLx4VUhqHLu47EnAI6F5VaTUkCfZBM0cho2rbqdMdKin9K6Ay8piDEj1i3azxZCVkUFNqDAZDZD"
// FACEBOOK (security thing)
app.get('/webhook/', function(req, res) {
  // hub?
  if (req.query['hub.verify_token'] === "dannyisexy") {
    res.send(req.query['hub.challenge'])
  }
  res.send("Wrong token")
})


app.listen(app.get('port'), function(){
  console.log('running: port')
})
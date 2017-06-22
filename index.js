'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const app = express()

app.set('port', (process.env.PORT || 8000))

// Allow us to process the data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// ROUTES
app.get('/', function(req, res) {
  res.send("Hi, I am a chatbot")
})

app.get('/setup', function(req, res){
  setupGetStartedButton(res);
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

app.post('/webhook/', function(req, res) {
  let messaging_events = req.body.entry[0].messaging
  for (let i = 0; i < messaging_events.length; i++){
    let event = messaging_events[i]
    let sender = event.sender.id
    if (event.postback && event.postback.payload === "getstarted") {
      sendText(sender, "歡迎來到高醫套房， 請問你想了解什麼？房型？價錢？特色")
    }
    if (event.message && event.message.text) {
      let text = event.message.text
      decideMessage(sender, text)
    }
  }
  res.sendStatus(200)
})

function decideMessage(sender, text) {
  if (text.includes("房型")) {
    sendText(sender, "我們這裡有一間5坪房間， 6間6坪房間， 2間7坪房間")
  } else if ( text.includes("價錢")) {
    sendText(sender, "長期約: 1年合約: 每月5500-6800$，2個月押金")
  } else if (text.includes("特色")) {
    sendText(sender, "獨立廁所，雙人床，桌子椅子，電視，冰箱，冷氣，烘洗衣機")
  } else {
    sendText(sender, "如果有更多問題, 請打給 0800-123-333。 會有專人幫你服務")
  }
}

function setupGetStartedButton(res){
  var messageData = {
          "get_started":{
              "payload":"getstarted"
          }
  };
  // Start the request
  request({
      url: "https://graph.facebook.com/v2.6/me/messenger_profile?access_token="+ token,
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      form: messageData
  },
  function (error, response, body) {
      if (!error && response.statusCode == 200) {
          // Print out the response body
          res.send(body);

      } else {
          // TODO: Handle errors
          res.send(body);
      }
  });
}


function sendText(sender, text) {
  let messageData = {text: text}
  sendRequest(sender, messageData)
}

function sendRequest(sender, messageData) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: { access_token: token },
    method: "POST",
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function(error, response, body) {
    if (error){
      console.log("sending error")
    } else if (response.body.error){
      console.log("response body error")
    }
  })
}


app.listen(app.get('port'), function(){
  console.log('running: port')
})

app.post('/message', function (req, res) {
    var resp = new MessagingResponse();
    if( req.body.Body.trim().toLowerCase() === 'subscribe' ) {
      var fromNum = req.body.From;
      if(numbers.indexOf(fromNum) !== -1) {
        resp.message('You already subscribed!');
      } else {
        resp.message('Thank you, you are now subscribed. Reply "STOP" to stop receiving updates.');
        dbTasks.push(fromNum);
      }
    } else {
      resp.message('Welcome to Daily Updates. Text "Subscribe" receive updates.');
    }
  
    res.writeHead(200, {
      'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  
  });

var twilio= require('twilio');
var client = new twilio('ACdb9883811fd1aba6da1f6c1df63472a0','e8c5380d34c500076532a03c9046435f');
 client.messages.create({to:'+12257183339',from:'+12254429570', body:'Hwllo!'},function(err,data){});
 var numbers = ['+1 225 718 3339', '+1 225 718 3339'];
 for( var i = 0; i < numbers.length; i++ ) {
    client.messages.create( { to:numbers[i], from:'+1 225 442 9570', body:'Hello! Hope you’re having a good day.'}, function( err, data ) {
      console.log( data.body );
    });
  }

var express = require('express');
bodyParser = require('body-parser');
var MessagingResponse = require('twilio').twiml.MessagingResponse;
app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/message', function (req, res) {
    var resp = new MessagingResponse();
    resp.message('Thanks for subscribing!');
    res.writeHead(200, {
      'Content-Type':'text/xml'
    });
    res.end(resp.toString());
  });
var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
  });
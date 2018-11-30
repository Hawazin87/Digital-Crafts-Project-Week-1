const express = require('express');
const app = express();
const accountSid = 'ACdb9883811fd1aba6da1f6c1df63472a0';
const authToken = 'e8c5380d34c500076532a03c9046435f';
const client = require('twilio')(accountSid, authToken);

function serverListening(){
    console.log("listening...");
}

function sendVerificationCode(req,res){

    var phoneNumber = req.params.pn.toString();
    var code =  Math.floor(100000 + Math.random() * 900000);
    res.status(200).send(code.toString());
   

    client.messages
      .create({
         body: code,
         from: '12254429570',
         to: phoneNumber
       })
      .then(message => console.log(message.sid))
      .done();
    }




function sendMeme (req,res) {
    var phoneNumber = req.params.pn.toString();
    var meme = app.get("https://api.imgflip.com/get_memes");
    console.log(meme);
    res.status(200).send(meme);
   

    client.messages
      .create({
         MediaUrl: meme,
         body: "hello",
         from: '12254429570',
         to: phoneNumber
       })
      .then(message => console.log(message.sid))
      .done();
    
}

app.get('/fetchMeme/:pn',sendMeme);
app.get('/sendCode/:pn',sendVerificationCode);
app.listen(3000, serverListening());
app.use(express.static('public'));
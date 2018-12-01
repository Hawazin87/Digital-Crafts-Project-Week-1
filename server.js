const express = require('express');
const app = express();
const accountSid = 'ACdb9883811fd1aba6da1f6c1df63472a0';
const authToken = 'e8c5380d34c500076532a03c9046435f';
const client = require('twilio')(accountSid, authToken);

function serverListening(){
    console.log("listening...");
}

function sendAlert(req,res){

    var phoneNumber = req.params.pn.toString();
    var img = req.params.img.toString();
    res.status(200).send("alert succesfully sent!");


    client.messages.create({
         body: "From your friends at Meme-spiration!",
         mediaUrl: img,
         from: '12254429570',
         to: phoneNumber
       }).then(message => console.log("Alert succesfully sent!")).done();
    }

function sendVerificationCode(req,res){

    var phoneNumber = req.params.pn.toString();
    var code =  Math.floor(100000 + Math.random() * 900000);
    res.status(200).send(code.toString());
   

    client.messages.create({
         body: code,
         from: '12254429570',
         to: phoneNumber
       }).then(message => console.log(message.sid)).done();
    }

app.get('/sendCode/:pn',sendVerificationCode);
app.get('/sendAlert/:pn/:img',sendAlert);
app.listen(3000, serverListening());
app.use(express.static('public'));
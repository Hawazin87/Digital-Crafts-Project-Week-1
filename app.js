const accountSid = 'ACdb9883811fd1aba6da1f6c1df63472a0';
const authToken = 'e8c5380d34c500076532a03c9046435f';
const client = require('twilio')(accountSid, authToken);

function sendVerificationCode(number){

    var code =  Math.floor(100000 + Math.random() * 900000);
    console.log(code);
    console.log(number);
    client.messages
      .create({
         body: code,
         from: '12254429570',
         to: number
       })
      .then(message => console.log(message.sid))
      .done();
    }


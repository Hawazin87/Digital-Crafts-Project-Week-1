

const accountSid = 'ACdb9883811fd1aba6da1f6c1df63472a0';
const authToken = 'e8c5380d34c500076532a03c9046435f';
const client = require('twilio')(accountSid, authToken);
function sendVerificationCode(){

    var code =  Math.floor(100000 + Math.random() * 900000);
    
    client.messages
      .create({
         body: code,
         from: '12254429570',
         
         mediaUrl: 'https://spectatorau.imgix.net/content/uploads/2017/08/Snip20170801_15.png?auto=compress,enhance,format&crop=faces,entropy,edges&fit=crop&w=820&h=550',
         to: '2257183339'
       })
      .then(message => console.log(message.sid))
      .done();
    }

sendVerificationCode();
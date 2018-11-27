
var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var loginButton = document.getElementById("log-in-button");
var signUpButton = document.getElementById("sign-up-button");
var createAccountButton = document.getElementById("create-account-button");
var authBox = document.getElementById("auth-box");
var captchaForm= document.getElementById("verification-code-form");
var verificationFields = document.getElementById("verification-fields");
var sendCodeButton = document.getElementById("send-code-button");
var verifyCodeButton = document.getElementById("verify-code-button");
var verifiedBlock = document.getElementById("verified-block");
var sentCode="";
var savedPhoneNumber = localStorage.getItem("localStoragePN");
const accountSid = 'ACdb9883811fd1aba6da1f6c1df63472a0';
const authToken = 'e8c5380d34c500076532a03c9046435f';
const client = require('twilio')(accountSid, authToken);


function showSignUpForm(){

    signUpButton.style.setProperty("display","none");
    createAccountButton.style.setProperty("display","none");
    loginButton.style.setProperty("display","none");
    authBox.style.setProperty("display","block");
    signUpForm.style.setProperty("display","block");
    
}

function showLoginForm(){
    signUpButton.style.setProperty("display","none");
    loginButton.style.setProperty("display","none");
    authBox.style.setProperty("display","block");
    logInForm.style.setProperty("display","block");
}

function createNewAccount(){

        
        email = document.getElementById("sign-up-email").value;
        password = document.getElementById("sign-up-password").value; 
        var phoneNumber = document.getElementById("sign-up-number").value;
        firebase.auth().createUserWithEmailAndPassword(email, password,).then(function(){
            writeUserData();
            
            }).catch(function(error) {
            alert(error.message);
            });

      
        
}
       

function loginToExistingAccount(){

        email = document.getElementById("login-email").value;
        password = document.getElementById("login-password").value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        window.location.href = "dashboard.html";
        }).catch(function(error) {
        alert(error.message);
        });
}

function cancel(){
    location.reload();
}

function logOutUser(){

    firebase.auth().signOut().then(function() {
          window.location.href = "index.html";
      }).catch(function(error) {
            alert(error);
        });
 }

 function setUserName(un,pp){

    var user = firebase.auth().currentUser;

    user.updateProfile({

        displayName: un,
        photoURL: pp.name,

        }).then(function() {
        window.location.href = "dashboard.html";
        }).catch(function(error) {
            alert(error);
        });

}

function savePic(un,pp){

    storageRef.child(`images/${un}/${pp.name}`).put(pp); 

}
function first() {
    localStorage.setItem('myItem', "something you want to store");
}

function second() {
    myValue = null;
    if (localStorage.getItem('myItem')) {
        myValue = localStorage.getItem('myItem');
    }
}
function savePhoneNumber(phone){
    var user = firebase.auth().currentUser;
    var phoneRef = firebase.database().ref(`usernames/${user.displayName}/phoneNumber`);
    var newPhoneRef = phoneRef.push();
    newPhoneRef.set({
     
      phone:phone,
      
    });
  }

 function writeUserData(){

    var userName = document.getElementById("sign-up-username").value;
    var profilePic = document.getElementById("sign-up-pic").files[0];
    
    savePic(userName,profilePic);
    setUserName(userName,profilePic);


}

function renderAccount(){

firebase.auth().onAuthStateChanged(function(user){
    console.log(user);
    if(user == null){
        window.location.href = "index.html";
    }else{
            var userName = user.displayName;
            var profilePic = user.photoURL;
            const storageService = firebase.storage();
            const storageRef = storageService.ref();
            storageRef.child(`images/${userName}/${profilePic}`).getDownloadURL().then(function(url){
                document.querySelector('img').src = url;
            }).catch(function(error){
                alert(error);
            });
            var greeting = document.getElementById("greeting");
            greeting.innerHTML = `Welcome back<br> ${userName}!`;

    };
    
    savePhoneNumber(savedPhoneNumber);
});
}

function addTask(){

    var task = document.getElementById("task").value;
    var dueDate = document.getElementById("due-date").value;
    var alertFrequency = document.getElementById("alert-frequency").value;
    var time = document.getElementById("time").value;

    if(task == "" || dueDate == "" || alertFrequency == "" || time == ""){
        alert("all fields are required to add task");
    }else{
        var user = firebase.auth().currentUser;
        firebase.database().ref(`usernames/${user.displayName}/tasks/${task}`).set({
            Duedate:dueDate,
            Time:time,
            AlertFrequency:alertFrequency
        });
    }

}

function listenForAddedTasks(){

    var tasksBox = document.getElementById("tasks");
    var tasks = "";
    var user = firebase.auth().currentUser;
    var dbTasks = firebase.database().ref(`usernames/${user.displayName}/tasks/`);

    dbTasks.on('value',function(snapshot){

        while(tasksBox.firstChild){
            tasksBox.removeChild(tasksBox.firstChild);
        }

    snapshot.forEach(function(task){
        var toDoItem = task;
        var dueDate = task.Duedate;
        var time = task.Time;

        tasks += `<tr>
                    <td>${toDoItem}</td>
                    <td>${dueDate}</td>
                    <td>${time}</td>
                    <td><input type="checkbox" class="checkbox"></td>
                    </tr>`

        tasksBox.innerHTML = tasks;

    });
});
};

function showSendCodeButton(){
    var phoneNumberInput = document.getElementById("sign-up-number").value;
    if(phoneNumberInput.length >= 10){
        sendCodeButton.style.setProperty("display","block");
    }else{
        return;
    }
}

function showVerifyCodeFields(){
    var phoneNumberInput = document.getElementById("sign-up-number").value;
    first(phoneNumberInput);
    second();
    function isDomestic(pn){
        if(pn.length == 10){
            return true;
        }else{
            return false;
        }
    };


        if(isDomestic(phoneNumberInput) == true){

            var internationalizedNumber = "1"+phoneNumberInput;

            sendVerificationCode(internationalizedNumber);
            sendCodeButton.style.setProperty("display","none");
            verificationFields.style.setProperty("display","block");
        }else{
            sendVerificationCode(phoneNumberInput);
            sendCodeButton.style.setProperty("display","none");
            verificationFields.style.setProperty("display","block");
        }
}

function showVerifyCodeButton(){
    var verificationCode = document.getElementById("verification-code-input").value;
    if(verificationCode.length == 6){
        verifyCodeButton.style.setProperty("display","block");
    }else{
        return;
    }
}



function sendVerificationCode(){
    var phoneNumberInput = document.getElementById("sign-up-number").value;
    var generatedCode =  Math.floor(100000 + Math.random() * 900000);
    sentCode=generatedCode;
    console.log(generatedCode);
    console.log(sentCode);
    
     client.messages
      .create({
         body: generatedCode,
         from: '12254429570',
         to: phoneNumberInput
       })
      .then(message => console.log(message.sid))
      .done();
}

function verifyCode(){
    console.log(sentCode);
  
    var verificationCode = document.getElementById("verification-code-input").value;
    console.log(verificationCode);
    if(verificationCode.length != 6){
        alert("verification code must be 6 digits in length");
        return;
    }else if(sentCode!=verificationCode){
        alert("Code does not match!");
        return;
    }
    else if(sentCode==verificationCode){
        console.log("sucess");
    verifiedBlock.style.setProperty("display","block");
    createAccountButton.style.setProperty("display","block");
    verificationFields.style.setProperty("display","none");
    }
    
}

function first(number) {
    localStorage.setItem('localStoragePN', `1${number}`);
}


function second() {
    myValue = null;
    if (localStorage.getItem('localStoragePN')) {
        myValue = localStorage.getItem('localStoragePN');
    }
}


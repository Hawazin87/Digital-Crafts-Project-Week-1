var twilio = require('./app.js');
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
        console.log(phoneNumber);
        firebase.auth().languageCode = 'en';

        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-up-button', {
            'size': 'visible',
            'callback': function(response) {
              onSignInSubmit();
            }
          });
      
        
        var appVerifier = window.recaptchaVerifier;
        var code = document.getElementById();
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {

            captchaForm.style.setProperty("display","block");
            
            window.confirmationResult = confirmationResult;
            window.signingIn = false;
            
            confirmationResult.confirm(code).then(function (result) {
                console.log("hello")
            // User signed in successfully.
            var user = result.user;
            // if you run without verifyEmail, you can see phone number "2257183339" saved in phoneNumber in the network under VerifyPhoneNumber
            
            //verifyEmail()
            // ...
            }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            // ...
            });
            }).catch(function (error) {
            // Error; SMS not sent
            // ...
            console.error('Error during signInWithPhoneNumber', error);
            window.alert('Error during signInWithPhoneNumber:\n\n'
                + error.code + '\n\n' + error.message);
            window.signingIn = false;
            grecaptcha.reset(window.recaptchaWidgetId);
            
            });

           
    
}
function verifyEmail(){
    firebase.auth().createUserWithEmailAndPassword(email, password,).then(function(){
        writeUserData();
        
        }).catch(function(error) {
        alert(error.message);
        });
}
function verifyCode() {
    //e.preventDefault();
    var verificationCode=document.getElementById("verification-code");
    console.log(verificationCode);
    if (verificationCode == "123456") {
      window.verifyingCode = true;
      console.log(verificationCode);
      
      
      confirmationResult.confirm(verificationCode).then(function (result) {
        // User signed in successfully.
        var user = result.user;
        window.verifyingCode = false;
        window.confirmationResult = null;
        
      }).catch(function (error) {
        // User couldn't sign in (bad verification code?)
        console.error('Error while checking the verification code', error);
        window.alert('Error while checking the verification code:\n\n'
            + error.code + '\n\n' + error.message);
        window.verifyingCode = false;
        
      });
    }
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

function savePhoneNumber(phone){
    var user = firebase.auth().currentUser;
    var phoneRef = firebase.database().ref('phoneNumber');
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

    }
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



function verifyCode(){
    //code that verifies
    var verificationCode = document.getElementById("verification-code-input").value;
    if(verificationCode.length != 6){
        alert("verification code must be 6 digits in length");
        return;
    }else{
    verifiedBlock.style.setProperty("display","block");
    createAccountButton.style.setProperty("display","block");
    verificationFields.style.setProperty("display","none");
    }
}
//funtion 1
//pass phoneNumber to function that 
//generates random int of length 6

//verifyCode modification
//compares code input with code sent for equality
//

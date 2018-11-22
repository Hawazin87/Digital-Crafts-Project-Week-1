var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var signUpButton = document.getElementById("sign-up-button");
var loginButton = document.getElementById("log-in-button");
var authBox = document.getElementById("auth-box");
var captchaForm= document.getElementById("verification-code-form");

function showSignUpForm(){
    signUpButton.style.setProperty("display","none");
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
        var phoneNumber ="+12257183339"//document.getElementById("sign-up-number").value;
        
        
        

        firebase.auth().languageCode = 'en';
        // To apply the default browser preference instead of explicitly setting it.
        // firebase.auth().useDeviceLanguage();  
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-up-button', {
            'size': 'invisible',
            'callback': function(response) {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              onSignInSubmit();
              console.log(onSignInSumbit());
            }
          });
      
        
        var appVerifier = window.recaptchaVerifier;
        var code = "123456";
        firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
            .then(function (confirmationResult) {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            console.log("foo");
            captchaForm.style.setProperty("display","block");
            
            window.confirmationResult = confirmationResult;
            window.signingIn = false;
            confirmationResult.confirm(code).then(function (result) {
                console.log("hello")
            // User signed in successfully.
            var user = result.user;
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

           /* firebase.auth().createUserWithEmailAndPassword(email, password,).then(function(){
            writeUserData();
            
            }).catch(function(error) {
            alert(error.message);
            }); */
    
}

function verifyCode() {
    //e.preventDefault();
    var verificationCode=document.getElementById("verification-code");
    console.log(verificationCode);
    if (verificationCode="123456") {
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
/*function savePhoneNumber(phone){
    var user = firebase.auth().currentUser;
    var phoneRef = firebase.database().ref('messages');
    var newPhoneRef = phoneRef.push();
    newPhoneRef.set({
     
      phone:phone,
      
    });
  }*/

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

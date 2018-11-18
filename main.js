var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var signUpButton = document.getElementById("sign-up-button");
var loginButton = document.getElementById("log-in-button");
var authBox = document.getElementById("auth-box");
var database = firebase.database();


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
    var userNumber = database.ref(`usernames/${un}`).once("value").then(function(snapshot){
        console.log(snapshot.val().phonenumber);
        return snapshot.val().phonenumber;
    }).catch(function(error){
        alert(error.message);
    });

    console.log(userNumber);

    user.updateProfile({

        displayName: un,
        photoURL: pp,
        //phoneNumber: userNumber

        }).then(function() {
        window.location.href = "dashboard.html";
        }).catch(function(error) {
            alert(error);
        });

}

 function writeUserData(){

    var userName = document.getElementById("sign-up-username").value;
    //var phoneNumber = document.getElementById("sign-up-number").value;
    var profilePic = document.getElementById("sign-up-pic").value;

    database.ref(`usernames/${userName}`).set({

        username: userName,
        //phonenumber: phoneNumber,
        profilepic: profilePic

    });

    setUserName(userName,profilePic);

}

function isUserLoggedIn(){
        return firebase.auth().onAuthStateChanged(function(user) {
        return user;
      })
}


function renderAccount(){

    if(isUserLoggedIn != null){

        firebase.auth().onAuthStateChanged(function(user) {
            console.log(user);
            //console.log(user.phoneNumber);
            console.log(user.photoURL);
            var userName = user.displayName;
            var greeting = document.getElementById("greeting");
            greeting.innerHTML = `Welcome back ${userName}!`;

          });

        }else{
        window.location.href = "index.html";
        return;
    }
}
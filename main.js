var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var signUpButton = document.getElementById("sign-up-button");
var loginButton = document.getElementById("log-in-button");


function showSignUpForm(){
    signUpButton.style.setProperty("display","none");
    loginButton.style.setProperty("display","none");
    signUpForm.style.setProperty("display","block");

}

function showLoginForm(){
    signUpButton.style.setProperty("display","none");
    loginButton.style.setProperty("display","none");
    logInForm.style.setProperty("display","block");

}

function createNewAccount(){

        //username = document.getElementById("sign-up-username").value;
        email = document.getElementById("sign-up-email").value;
        password = document.getElementById("sign-up-password").value;
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
        console.log("new account created successfully");
        window.location.href = "dashboard.html";
        }).catch(function(error) {
        var errorMessage = error.message;
        alert(errorMessage);
        return;
        });
    
}

function loginToExistingAccount(){

        //username = document.getElementById("sign-up-username").value;
        email = document.getElementById("login-email").value;
        password = document.getElementById("sign-up-password").value;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
        console.log("Logged in successfully");
        window.location.href = "dashboard.html";
        }).catch(function(error) {
        var errorMessage = error.message;
        alert(errorMessage);
        return;
        });

}

function cancel(){
    location.reload();
}


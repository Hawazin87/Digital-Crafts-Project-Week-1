var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var signUpButton = document.getElementById("sign-up-button");
var loginButton = document.getElementById("log-in-button");
var authBox = document.getElementById("auth-box");

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

var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var signUpButton = document.getElementById("sign-up-button");
var loginButton = document.getElementById("log-in-button");
var authBox = document.getElementById("auth-box");
var myTasksHeader = document.getElementById("my-tasks-header");
var taskArchiveHeader = document.getElementById("task-archive-header");
var listHeading = document.getElementById("list-heading");
var taskItems = document.getElementById("tasks");
var myTasksButton = document.getElementById("my-tasks-button");
var viewTaskArchiveButton = document.getElementById("view-task-archive-button");
var saveChangesButton = document.getElementById("save-changes-button");
var showArchiveButton = document.getElementById("archive-completed-button");
var archiveCompletedButton = document.getElementById("archive-completed-button");
var saveButton = document.getElementById("save-changes-button");
var taskArchiveButton = document.getElementById("view-task-archive-button");


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

        var email = document.getElementById("sign-up-email").value;
        var password = document.getElementById("sign-up-password").value;     
        firebase.auth().createUserWithEmailAndPassword(email, password,).then(function(){
        writeUserData();
        }).catch(function(error) {
        alert(error.message);
        });
        
}

function loginToExistingAccount(){

        var email = document.getElementById("login-email").value;
        var password = document.getElementById("login-password").value;
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
            Task:task,
            Duedate:dueDate,
            Time:time,
            AlertFrequency:alertFrequency
            
        });
    }

}




firebase.auth().onAuthStateChanged(function(user){
    listenForAddedTasks(user);
});

function listenForAddedTasks(user){
    var tasksBox = document.getElementById("tasks");
    var tasks = "";
    var path = `usernames/${user.displayName}/tasks/`;
    var dbTasks = firebase.database().ref(path);
    dbTasks.on('value',function(snapshot){

        while(tasksBox.firstChild){
            tasksBox.removeChild(tasksBox.firstChild);
        }

    snapshot.forEach(function(task){
        var toDoItem = task.val().Task;
        var dueDate = task.val().Duedate;
        var time = task.val().Time;
        var alertFrequency = task.val().AlertFrequency;

        tasks += `<div class="row rendered-list">
                    <input onchange = "showSaveButton()" id = "to-do-item" type="text" value = "${toDoItem}" >
                    <input onchange = "showSaveButton()" id = "to-do-date" type="date" value = "${dueDate}" >
                    <input onchange = "showSaveButton()" id = "to-do-time" type="time" value = "${time}" >
                    <select onchange = "showSaveButton()" required="true" name="alert-frequency-set" id="alert-frequency-set">
                    <option>on:${alertFrequency}</option>
                    <option>1 Day prior</option>
                    <option>1 Hour prior</option>
                    <option>30 min prior</option>
                    </select>
                    <input onclick = "showArchiveCompletedButton()" type="checkbox" class="mt-4" style="margin:0 auto;">
                    </div>`;
                   

        tasksBox.innerHTML = tasks;
    });
});
};


firebase.auth().onAuthStateChanged(function(up){
    updateTasks(up);
});

function updateTasks(up){
    // var path = `usernames/${up.displayName}/tasks/`;
    // console.log(path);
    var archTask = document.getElementById("task").value;
    var dueDate = document.getElementById("due-date").value;
    var time = document.getElementById("time").value;
    var dbArchive = firebase.database().ref(`usernames/${up.displayName}/tasks/`);
    console.log(up.displayName);
   dbArchive.orderByValue().on("value", function(snapshot) {
    snapshot.forEach(function(data) {
        
        console.log(data.key);
    });
    
});

firebase.database().ref(`usernames/${up.displayName}/archive/`).set({
     Archtask:archTask,
    // Duedate:dueDate,
    // Time:time
}); 

}  
 


  



function showSaveButton(){
    saveButton.style.setProperty("display","block");
}

function showArchiveCompletedButton(){
    archiveCompletedButton.style.setProperty("display","block");
}
function showArchiveButton(){
    taskArchiveButton.style.setProperty("display","block");
}

function viewArchive(){

    viewTaskArchiveButton.style.setProperty("display","none");
    myTasksHeader.style.setProperty("display", "none");
    taskArchiveHeader.style.setProperty("display","block");
    listHeading.style.setProperty("display","none");
    taskItems.style.setProperty("display","none");
    myTasksButton.style.setProperty("display","block");
    saveChangesButton.style.setProperty("display","none");
    archiveCompletedButton.style.setProperty("display","none");

}

function viewTasks(){

window.location.href = "dashboard.html";

}




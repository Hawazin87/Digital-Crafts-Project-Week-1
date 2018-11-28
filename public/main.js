
var signUpForm = document.getElementById("sign-up-form");
var logInForm = document.getElementById("log-in-form");
var loginButton = document.getElementById("log-in-button");
var signUpButton = document.getElementById("sign-up-button");
var createAccountButton = document.getElementById("create-account-button");
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
var archiveWrapper = document.getElementById("archive-wrapper");
var archiveBox = document.getElementById("archive-box");
var archiveListHeading = document.getElementById("archive-list-heading");
var captchaForm= document.getElementById("verification-code-form");
var verificationFields = document.getElementById("verification-fields");
var sendCodeButton = document.getElementById("send-code-button");
var verifyCodeButton = document.getElementById("verify-code-button");
var verifiedBlock = document.getElementById("verified-block");
var axios = require('axios');
// var sentCode = "";


var convertFromMilitaryToStd = function (fourDigitTime){
    var hours24 = parseInt(fourDigitTime.substring(0,2));
    var hours = ((hours24 + 11) % 12) + 1;
    var amPm = hours24 > 11 ? 'pm' : 'am';
    var minutes = fourDigitTime.substring(2);

    return hours + minutes + amPm;
};


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
        var email = document.getElementById("sign-up-email").value;
        var password = document.getElementById("sign-up-password").value;     
        var phoneNumber = document.getElementById("sign-up-number").value;
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
// function savePhoneNumber(phone){
//     var user = firebase.auth().currentUser;
//     var phoneRef = firebase.database().ref(`usernames/${user.displayName}/phoneNumber`);
//     var newPhoneRef = phoneRef.push();
//     newPhoneRef.set({
     
//       phone:phone,
      
//     });
//   }

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

    };
    
    // savePhoneNumber(savedPhoneNumber);
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
            DueDate:dueDate,
            Time:time,
            AlertFrequency:alertFrequency
            
        });
        window.location.href = "dashboard.html";
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
    

    while(tasksBox.firstChild){
        tasksBox.removeChild(tasksBox.firstChild);
    }

    dbTasks.on('value',function(snapshot){

    snapshot.forEach(function(task){
        console.log(task.val())
        var toDoItem = task.val().Task;
        var dueDate = task.val().DueDate;
        var time = task.val().Time;
        var alertFrequency = task.val().AlertFrequency;

        tasks += `<div class="row rendered-list">
                    <input onchange = "showSaveButton()" id = "to-do-item" type="text" value = "${toDoItem}" >
                    <input onchange = "showSaveButton()" id = "to-do-date" type="date" value = "${dueDate}" >
                    <input onchange = "showSaveButton()" id = "to-do-time" type="time" value = "${time}">
                    <select onchange = "showSaveButton()" required="true" name="alert-frequency-set" id="alert-frequency-set">
                    <option>${alertFrequency}</option>
                    <option>1 Day prior</option>
                    <option>1 Hour prior</option>
                    <option>30 min prior</option>
                    </select>
                    <input onclick = "showArchiveCompletedButton()" type="checkbox" class="mt-4 check-box" style="margin:0 auto;">
                    </div>`;
                   

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

function sendVerificationCode(pn){

    var code =  Math.floor(100000 + Math.random() * 900000);
    
    client.messages
      .create({
         body: code,
         from: '12254429570',
        //  mediaUrl: 'https://spectatorau.imgix.net/content/uploads/2017/08/Snip20170801_15.png?auto=compress,enhance,format&crop=faces,entropy,edges&fit=crop&w=820&h=550',
         to: pn
       })
      .then(message => console.log(message.sid))
      .done();
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
console.log(isDomestic(phoneNumberInput));

        if(isDomestic(phoneNumberInput) == true){
console.log("invoked");
            var internationalizedNumber = "1"+phoneNumberInput;
            var endpoint = `/sendCode/${internationalizedNumber}`;
            // sendVerificationCode(internationalizedNumber);
            axios.get(endpoint);
            sendCodeButton.style.setProperty("display","none");
            verificationFields.style.setProperty("display","block");
        }else{
console.log("invoked");
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
    sentCode = generatedCode;
    // console.log(generatedCode);
    console.log(sentCode);
}

// function verifyCode(){
//     console.log(sentCode);
  
//     var verificationCode = document.getElementById("verification-code-input").value;
//     console.log(verificationCode);
//     if(verificationCode.length != 6){
//         alert("verification code must be 6 digits in length");
//         return;
//     }else if(sentCode!=verificationCode){
//         alert("Code does not match!");
//         return;
//     }
//     else if(sentCode==verificationCode){
//         console.log("sucess");
//     verifiedBlock.style.setProperty("display","block");
//     createAccountButton.style.setProperty("display","block");
//     verificationFields.style.setProperty("display","none");
//     }
    
// }

// function first(number) {
//     localStorage.setItem('localStoragePN', `1${number}`);
// }


// function second() {
//     myValue = null;
//     if (localStorage.getItem('localStoragePN')) {
//         myValue = localStorage.getItem('localStoragePN');
//     }
// }


function showSaveButton(){
    saveButton.style.setProperty("display","block");
}

function showArchiveCompletedButton(){
    var checkBoxes = document.getElementsByClassName("check-box");
    var checkBoxesArray = Array.from(checkBoxes);
    var findCompletedTasks = checkBoxesArray.find(function(checkbox){
        return checkbox.checked == true;
    });

   if(findCompletedTasks != undefined){
        archiveCompletedButton.style.setProperty("display","block");
   }else{
        archiveCompletedButton.style.setProperty("display","none");
       return;
   }

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
    archiveWrapper.style.setProperty("display","block");
    archiveBox.style.setProperty("display","block");
    archiveListHeading.style.setProperty("display","flex");


    firebase.auth().onAuthStateChanged(function(user){

        var path = `usernames/${user.displayName}/archive/`;
        var dbArchive = firebase.database().ref(path);

        dbArchive.once('value').then(function(snapshot){
            
            snapshot.forEach(function(task){

            var taskName = task.val().TaskName;
            var taskDate = task.val().TaskDate;
            var taskTime = convertFromMilitaryToStd(task.val().TaskTimeDue);
            var listOfArchivedTasks = "";

            listOfArchivedTasks += `<div class="row rendered-archive">
                <p>${taskName}</p>
                <p>${taskDate}</p>
                <p>${taskTime}</p>

            </div>`

            archiveBox.innerHTML += listOfArchivedTasks;

            });
        });
        });

}

function viewTasks(){

window.location.href = "dashboard.html";

}

function archiveCompleted(){

var checkBoxes = document.getElementsByClassName("check-box");
var checkBoxesArray = Array.from(checkBoxes);
checkBoxesArray.forEach(function(checkbox){
    if(checkbox.checked == true){
        firebase.auth().onAuthStateChanged(function(user){
            var taskName = checkbox.parentElement.children[0].value;
            var taskDueDate = checkbox.parentElement.children[1].value;
            var taskDueTime = checkbox.parentElement.children[2].value;
            var path = `usernames/${user.displayName}/archive/${taskName}`;
            var archivesDb = firebase.database().ref(path);
            var pathToTaskInTasksDir = firebase.database().ref(`usernames/${user.displayName}/tasks/${taskName}`);
            archivesDb.set({
                TaskName: taskName,
                TaskDate: taskDueDate,
                TaskTimeDue: taskDueTime
            });
            pathToTaskInTasksDir.remove();
            checkbox.parentElement.parentElement.removeChild(checkbox.parentElement);
        });
    }});
    window.location.href="dashboard.html";
};

function updateTasks(){

    firebase.auth().onAuthStateChanged(function(user){

        var renderedTasks = document.getElementsByClassName("rendered-list");
        var renderedTasksArray = Array.from(renderedTasks);
        var index = 0;
        var tasksDb = firebase.database().ref(`usernames/${user.displayName}/tasks/`);

            tasksDb.once('value',function(snapshot){

            snapshot.forEach(function(currentDbTask){

                var currentRenderedTaskName = renderedTasksArray[index].children[0].value;
                var currentRenderedTaskDueDate = renderedTasksArray[index].children[1].value;
                var currentRenderedTaskDueTime = renderedTasksArray[index].children[2].value;
                var currentRenderedTaskAlertFrequency = renderedTasksArray[index].children[3].value;
                var currentDbTask = currentDbTask.val().Task;
                var pathToCurrentDbTask = firebase.database().ref(`usernames/${user.displayName}/tasks/${currentDbTask}`);
                pathToCurrentDbTask.remove();
                var pathToUpdatedDbTask = firebase.database().ref(`usernames/${user.displayName}/tasks/${currentRenderedTaskName}`);
                pathToUpdatedDbTask.set({
                        Task: currentRenderedTaskName,
                        DueDate: currentRenderedTaskDueDate,
                        Time: currentRenderedTaskDueTime,
                        AlertFrequency: currentRenderedTaskAlertFrequency
                    });
                index++;
        });
        });
    });
    window.location.href = "dashboard.html";
};


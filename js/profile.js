console.log("Loaded profile.js");

/*Script Variables*/
let profileBody = document.getElementById("profileBody");
//Divs
let updateUN = document.getElementById("updateUN");
let updateEM = document.getElementById("updateEM");
let updatePW = document.getElementById("updatePW");
//Labels
let currentUNLbl = document.getElementById("currentUNLbl");
let currentEMLbl = document.getElementById("currentEMLbl");
//Buttons
let changeUNBtn = document.getElementById("changeUNBtn");
let changeEMBtn = document.getElementById("changeEMBtn");
let changePWBtn = document.getElementById("changePWBtn");
let updateUNBtn = document.getElementById("updateUNBtn");
let updateEMBtn = document.getElementById("updateEMBtn");
let updatePWBtn = document.getElementById("updatePWBtn");
//Textboxes
let updateUNTxt = document.getElementById("updateUNTxt");
let updateEMTxt = document.getElementById("updateEMTxt");
let newPWTxt = document.getElementById("newPWTxt");
let confirmPWTxt = document.getElementById("confirmPWTxt");

/*Event Listeners*/
profileBody.onload = function () { getUserInfo(); }
changeUNBtn.onclick = function () { displayDiv(updateUN); }
changeEMBtn.onclick = function () { displayDiv(updateEM); }
changePWBtn.onclick = function () { displayDiv(updatePW); }
updateUNBtn.onclick = function () { updateUsername(); }
updateEMBtn.onclick = function () { updateEmail(); }
updatePWBtn.onclick = function () { updatePassword(); }

/*Objects*/
let userBodyDTOUN = {
    "userId": currentUserId,
    "username": ""
}

let userBodyDTOEM = {
    "userId": currentUserId,
    "email": ""
}

let userBodyDTOPW = {
    "userId": currentUserId,
    "password": ""
}

/*Functions*/

function getUserInfo() {
    let userURL, userResp;

    //Setup request
    userURL = "http://localhost:8080/user/" + currentUserId;
    userResp = getRequest(userURL);

    if (userResp != "error") {//Request successful. Update page
        currentUNLbl.innerHTML = "Username: " + userResp.username;
        currentEMLbl.innerHTML = "Email: " + userResp.email;
    } else {//Request failed. Handle errors
        const errorMessage = document.createElement("error");
        errorMessage.textContent = "Connection Error!";
        alert(
            "FAILED: User details failed to load. Please Try Again or Contact Support."
        );
    }
}

function displayDiv(div) {
    console.log("displayDiv called");
    div.hidden = !(div.hidden)
}

function updateUsername() {
    console.log("updateUsername called");
    let UNregex = /^[a-zA-Z0-9_\-]+$/;
    let newUN = updateUNTxt.value;
    let putUNBody = userBodyDTOUN;
    let putUNURL = "http:/localhost:8080/user/";

    //Validate username
    if (loggedIn) {
        if (UNregex.test(newUN)) {//Username is valid
            putUNBody.username = newUN;

            //Send request
            putRequest(putUNURL, putUNBody);
        } else {//Username is invalid
            alert(
                "The username you entered is invalid. Please try again"
            );
        }
    } else {
        alert(
            "You must be logged in to update information"
        );
    }

    //Reset textboxes
    updateUNTxt.value = "";
}

function updateEmail() {
    console.log("updateEmail called");
    let EMregex = /^[a-z0-9_\-]{1,63}[@][a-z]{1,30}[.][a-z]{2,5}$/i
    let newEmail = updateEMTxt.value;
    let putEMBody = userBodyDTOEM;
    let putEMURL = "http:/localhost:8080/user/";

    //Validate email
    if (loggedIn) {
        if (EMregex.test(newEmail)) {//Email is valid
            putEMBody.email = newEmail;

            //Send request
            putRequest(putEMURL, putEMBody);
        } else {//Email is invalid
            alert(
                "The email you entered is invalid. Please try again"
            );
        }
    } else {
        alert(
            "You must be logged in to update information"
        );
    }

    //Reset textboxes
    updateEMTxt.value = "";
}

function updatePassword() {
    console.log("updatePassword called");
    let PWregex = /^[0-9a-zA-Z\-\.]{4,100}$/
    let pass1 = newPWTxt.value;
    let pass2 = confirmPWTxt.value;
    let putPWBody = userBodyDTOPW;
    let putPWURL = "http:/localhost:8080/user/";

    //Validate passwords
    if (loggedIn) {
        if (PWregex.test(pass1)) {
            if (pass1 == pass2) {//Passwords match
                putPWBody.password = pass2;

                //Send request
                putRequest(putPWURL, putPWBody);
            } else {//Passwords do not match
                alert(
                    "Passwords must match. Please try again"
                );
            }
        } else {
            alert(
                "The password you entered is invalid. Please try again"
            );
        }
    } else {
        alert(
            "You must be logged in to update information"
        );
    }

    //Reset textboxes
    newPWTxt.value = "";
    confirmPWTxt.value = "";
}

function getRequest(url) {
    let requestGet, responseGet;

    //Setup request
    requestGet = new XMLHttpRequest();
    requestGet.open("GET", url, false);

    requestGet.onload = function () {
        console.log("requestPut.onload called");

        //Request is successful
        if (requestGet.status >= 200 && requestGet.status < 300) {
            console.log("GET: Request is successful");
            console.log("Response: " + requestGet.response);
            responseGet = JSON.parse(requestGet.response);
        } else {//Request failed
            responseGet = "error";
            console.log("GET: Request failed");
        }
    }
    requestGet.send();
    return responseGet;
}

function putRequest(url, body) {
    let requestPut, jwt;

    jwt = sessionStorage.getItem("JWT");

    //Setup request
    requestPut = new XMLHttpRequest();
    requestPut.open("PUT", url, true);
    requestPut.setRequestHeader("Content-Type", "application/json");
    requestPut.setRequestHeader("Auth", jwt);
    requestPut.setRequestHeader("Username", sessionStorage.getItem("USERNAME"));

    requestPut.onload = function () {
        console.log("requestPut.onload called");

        //Request is successful
        if (requestPut.status >= 200 && requestPut.status < 300) {
            console.log("PUT: Request is successful");
            console.log("Response: " + requestPut.response);
            responsePut = JSON.parse(requestPut.response);
            alert(
                "Update Successful"
            );
        } else {//Request failed
            responsePut = null;
            console.log("PUT: Request failed");
            alert(
                "Update Failed"
            );
        }
    }
    console.log("PUT: body=" + JSON.stringify(body));
    requestPut.send(JSON.stringify(body));
}
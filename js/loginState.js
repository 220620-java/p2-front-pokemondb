console.log("Loaded loginState.js");

/*Script Variables*/
let loggedIn = sessionStorage.getItem("USER_ID");
let logImg = document.getElementById("log-img");
let logInImage = "images/log-in.png";
let logOutImage = "images/Log-Out.png";
let currentUserId = getUserId();

/*Event Listeners*/
logImg.onclick = function () { logStateChange(); }

/**
 * Retrieves the user id value in the Session variable.
 * This will be used to retrieve and post data.
 */
 function getUserId() {
    console.log("getUserId called");
    let userId = null;
    if (loggedIn) {
        loggedIn = true;
        logImg.src = logOutImage;
        console.log("USER_ID = " + sessionStorage.getItem("USER_ID"));
        userId = parseInt(sessionStorage.getItem("USER_ID"));
        console.log("currentUserId: " + userId);
        createUsernameLabel (sessionStorage.getItem("USERNAME"));
    } else {
        loggedIn = false;
        logImg.src = logInImage;
    }
    return userId;
}

/**Logs a user out or sends them to the login page based on loggedIn status
 */
 function logStateChange() {

	if (loggedIn) { //User is logged in. Will log them out
        sessionStorage.removeItem("USER_ID");
        sessionStorage.removeItem("USERNAME");
        sessionStorage.removeItem("JWT");
		loggedIn = false;
		currentUserId = null;
		logImg.src = "images/log-in.png";
	} else { //User is not logged in. Will link them to login.html
		window.location.href = "login.html";
	}
}

function createUsernameLabel (username) {
    if (loggedIn) {
        console.log("Creating username label!");
        // Grab target div
        const targetDiv = document.getElementsByClassName ("navContainer")[0];
        const userDiv = document.createElement("div");
        userDiv.id = "userDiv";

        const usernameLabel = username;
        const titleLine = document.createElement("p");
        const titleText = document.createTextNode("Logged in as " + usernameLabel);
        const profileLink = document.createElement("a");
        profileLink.href="/profile.html";
        profileLink.id = "userDivAnchor";
        titleLine.appendChild (titleText);
        userDiv.appendChild (titleLine);
        profileLink.appendChild (userDiv);
        targetDiv.after(profileLink);
    }
}
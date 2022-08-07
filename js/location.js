console.log("Loaded location.js");

/*Script Variables*/
let logImg = document.getElementById("logImg");
let loggedIn = false;
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
	if (sessionStorage.getItem("USER_ID") == null) {
		loggedIn = false;
		logImg.src = "images/log-in.png";
	} else {
		loggedIn = true;
		logImg.src = "images/Log-Out.png";
		console.log("USER_ID = " + sessionStorage.getItem("USER_ID"));
		userId = parseInt(sessionStorage.getItem("USER_ID"));
		console.log("currentUserId: " + userId);
	}
	return userId;
}

/**Logs a user out or sends them to the login page based on loggedIn status
 */
function logStateChange() {
	if (loggedIn) { //User is logged in. Will log them out
		sessionStorage.removeItem("USER_ID");
		logImg.src = "images/log-in.png";
		loggedIn = false;
		currentUserId = null;
	} else { //User is not logged in. Will link them to login.html
		window.location.href = "login.html";
	}
}
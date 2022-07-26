/**
 * Uses AJAX to send a POST request and offers the option to use callback functions
 */
function postRequest(url, json, onDone, onHeadersReceived, onLoading) {
	console.log("PREPARING POST REQUEST TO: " + url);

	// Opening a GET request to the URL by creating XML Http Request object
	let request = new XMLHttpRequest();

  	// Set a callback function for the readystatechange and load events
  	request.onreadystatechange = readyStateChange;
  	request.onload = load;

	request.open("POST", url, true);

	// If user has an jwt, put it in the header
    if (sessionStorage.getItem("JWT")) {
		request.setRequestHeader("Auth", sessionStorage.getItem("JWT"));
	}

	// If user has a username, put it in the header
    if (sessionStorage.getItem("USERNAME")) {
		request.setRequestHeader("Username", sessionStorage.getItem("USERNAME"));
	}

	// If user has a user id, put it in the header
	if (sessionStorage.getItem("USER_ID")) {
		request.setRequestHeader("UserId", sessionStorage.getItem("USER_ID"));
	}

	// Setting the header of the API request if there's a json object
	if (json) {
		request.setRequestHeader("Content-type", "application/json");
	}

	// Send out request
	request.send(json);

	// Asynchronously set up request
	// For displaying loading information
	function readyStateChange () {
		// HEADERS RECEIVED - send() has been called, and headers and status are available.
		if (request.readyState === 2) {
			console.log("POST Request is sent!");
			onHeadersReceived();
		}
		// LOADING - Downloading; responseText holds partial data.
		else if (request.readyState === 3) {
			console.log("POST response, loading it...");
			onLoading();
		}
		// DONE ready state is handled by onload
	}
	
	// DONE Ready State
	function load () {
		// if the request is good and valid, return the response
		if (request.status >= 200 && request.status < 300) {
			console.log("Status Text: " + request.status);
			let response = request.response;
			console.log("Response: " + response);
			if (onDone != null) {
				onDone(response, request.getResponseHeader("Auth"));
				return;
			}
		} 

		// if request is a redirect, return an unexpected error
		else if (request.status >= 300 && request.status < 400) {
			console.log(request.status);
			alert("UNEXPECTED REDIRECT RESPONSE! " + request.status);
			return null;
		} 
		
		//Error handling
		else {
			console.log(request.status);
			alert("POST REQUEST FAILED! " + request.status );
			return null;
		}
	}
}
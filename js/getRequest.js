export function getRequest(url, json, callback) {
	console.log("SENDING GET REQUEST TO: " + url);

	// Opening a GET request to the URL
	let request = new XMLHttpRequest();
	request.open("GET", url, false);

	// Setting the header of the API request
	if (json != null) {
		request.setRequestHeader("Content-type", "application/json");
	}

	// Asynchronously set up request
	request.onload = function () {
		console.log("GET Request is sent!");

		// if the request is good and valid, return the response
		if (request.status >= 200 && request.status < 300) {
			console.log("Status Text: " + request.status);
			let response = request.response;
			console.log("Response: " + response);
			if (callback != null) {
				callback(response);
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
			alert("GET REQUEST FAILED! " + request.status);
			return null;
		}
	};

	// Send out request
	request.send(json);
}
export function putRequest(url, json) {
  	console.log("SENDING PUT REQUEST TO: " + url);

  	// Opening a PUT request to the URL
  	let request = new XMLHttpRequest();
  	request.open("PUT", url, true);

	// Setting the header of the API request
    request.setRequestHeader("Content-type", "application/json");

  	// Asynchronously set up request
  	request.onload = function () {
		console.log("PUT Request is sent!");

		// if the request is good and valid, return the response
		if (request.status >= 200 && request.status < 300) {
			console.log("Status Text: " + request.statusText);
			console.log("Response: " + request.response);
			return request.response;
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
			alert("PUT REQUEST FAILED! " + request.status );
            return null;
		}
	};

	// Send out request
	request.send(json);
}
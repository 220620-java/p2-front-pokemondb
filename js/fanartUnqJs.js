console.log("Loaded fanartUnqJs.js");

/*Script Variables*/

let fanartUnqBody = document.getElementById("fanartUnqBody");
let fanartTitle = document.getElementById("fanartTitle");
let fanartAuthor = document.getElementById("fanartAuthor");
let fanartPostDate = document.getElementById("fanartPostDate");
let fanartTags = document.getElementById("fanartTags");
let fanartImg = document.getElementById("fanartImg");
let rateChk = document.getElementById("rateChk");
let rateImg = document.getElementById('rateImg');
let flagChk = document.getElementById('flagChk');
let flagImg = document.getElementById('flagImg');

/*Event Listeners*/

fanartUnqBody.onload = function () { getFanart(document.documentURI) };
rateChk.onchange = function () { rateChkCheckChanged(rateImg) };
flagChk.onchange = function () { flagChkCheckChanged(flagImg) };

/*Functions*/

/**
 *	Sends a GET request with an ID for a specific fanart. 
 *	The response is expected to have details specific to that fanart (i.e. url, author, etc.)
 *	Upon response, JS feeds the given information into its corresponding location
 */
function getFanart(doc_uri) {
	/*Function Variables*/
	let paramIndex, fanart, request, response;

	//Determining fanart_id
	paramIndex = doc_uri.lastIndexOf('/');
	fanart = doc_uri.substring((paramIndex + 1));

	// Opening a connection to the server
	console.log("Running fanartUnqJs.js with the id: " + fanart_id);
	let url = "localhost:8080/fanart/" + fanart_id;

	//Constructing a json object to store the information
	//in the request to be sent out.

	console.log("URL is: " + url);

	//Making a bridge to the server through XMLHttpRequest()
	request = new XMLHttpRequest();

	//Initializaing a request to the order
	request.open("GET", url, false);

	//Setting the header of the API request
	request.setRequestHeader("Content-type", "application/json");

	// Asynchronously set up request
	request.onload = function () {
		console.log("request.onload is called!");

		// if the request is good and valid, store the response in session storage
		if (request.status >= 200 && request.status < 300) {
			console.log("Request is sent!");
			console.log("Response: " + request.response);
			console.log("Status Text: " + request.statusText);
			response = request.response;
			sessionStorage.setItem("fanart_object", response);
			response = JSON.parse(fanart_response);

			//Setting elements
			fanartTitle.innerHTML = response.title;
			fanartAuthor.innerHTML = response.author;
			fanartPostDate.innerHTML = response.postDate;
			fanartTags.innerHTML = response.tags;
			fanartImg.src = response.url;
		} else {
			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			console.log(request.status);
			alert(
				"FAILED: Getting Pokemon Failed!, Please Try Again or Contact Support."
			);

			//Setting elements
			fanartTitle.innerHTML = "Spheal With It!";
			fanartAuthor.innerHTML = "Leanardo Devinci";
			fanartPostDate.innerHTML = "07/06/1841";
			fanartTags.innerHTML = "spheal, leanardodevinci";
			fanartImg.src = "images/fanart/spheal.png";
		}
	};
	// Send out request
	request.send(null);

}

/**
 *	Changes the image file between heart.png and heartEmpty.png based on the checked state
 */
function rateChkCheckChanged(imageId) {
	console.log("rateChk.onchange called");
	let url = "";
	if (rateChk.checked) {
		url = "images/heart.png";
	}
	else {
		url = "images/heartEmpty.png";
	}
	console.log(imageId + " src changed to" + url);
	imageId.src = url;
}

/**
 *	Changes the image file between flag.png and flagLow.png based on the checked state
 */
function flagChkCheckChanged(imageId) {
	console.log("rateChk.onchange called");
	let url = '';
	if (flagChk.checked) {
		url = 'images/flag.png';
	}
	else {
		url = 'images/flagLow.png';
	}
	console.log(imageId + " src changed to" + url);
	imageId.src = url;
}
console.log("Loaded fanartUnqJs.js");

/*
	fanartUnqBody.onload
*/

let fanartUnqBody = document.getElementById("fanartUnqBody");

//fanartUnqBody.onload = getFanart;

/*Sends a GET request with an ID for a specific fanart. 
	The response is expected to have detail specific to that fanart (i.e. url, author, etc.)
	Upon response, JS feeds the given information into its corresponding location */
function getFanart(fanart_id) {
  	// Opening a connection to the server
  	console.log("Running fanartUnqJs.js with the id: " + fanart_id);
  	let url = "localhost:8080/fanart/" + fanart_id;
  	//constructing a json object to store the information
  	//in the request to be sent out.

  	console.log("URL is: " + url);

  	//Making a bridge to the server through XMLHttpRequest()
  	let request = new XMLHttpRequest();

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
			let fanart_response = request.response;
			sessionStorage.setItem("fanart_object", fanart_response);
			return pokemon_response;
		} else {
			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			console.log(request.status);
			alert(
				"FAILED: Getting Pokemon Failed!, Please Try Again or Contact Support."
			);
		}
	};
	// Send out request
	request.send(null);

}

/*
	rateChk.onchange
*/

//Assigning Variables
let rateChk = document.getElementById('rateChk');
let rateImg = document.getElementById('rateImg');

//Adding event listener
rateChk.onchange = function () { rateChkCheckChanged(rateImg) };

/*Changes the image file between heart.png and heartEmpty.png based on the checked state*/
function rateChkCheckChanged(imageId){
	console.log("rateChk.onchange called");
	let url = "";
	if (rateChk.checked){
		url = "images/heart.png";
	}
	else{		
		url = "images/heartEmpty.png";
	}
	console.log(imageId + " src changed to" + url);
	imageId.src = url;
}

/*
	flagChk.onchange
*/

//Assigning Variables
let flagChk = document.getElementById('flagChk');
let flagImg = document.getElementById('flagImg');

//Adding event listener
flagChk.onchange = function () { flagChkCheckChanged(flagImg) };

/*Changes the image file between flag.png and flagLow.png based on the checked state*/
function flagChkCheckChanged(imageId){
	console.log("rateChk.onchange called");
	let url = '';
	if (flagChk.checked){
		url = 'images/flag.png';
	}
	else{		
		url = 'images/flagLow.png';
	}
	console.log(imageId + " src changed to" + url);
	imageId.src = url;
}
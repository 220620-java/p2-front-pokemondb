console.log("Loaded fanartUnqJs.js");
console.log(document.documentURI);

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
let prevArt = document.getElementById('prevArt');
let nextArt = document.getElementById('nextArt');
let currentArtId = getArtId();
let idLowerLimit, idUpperLimit;

/*Event Listeners*/

fanartUnqBody.onload = function () { getFanart(); }
rateChk.onchange = function () { rateChkCheckChanged(rateImg) };
flagChk.onchange = function () { flagChkCheckChanged(flagImg) };
prevArt.onclick = function () { prevArtClick(); }
nextArt.onclick = function () { nextArtClick(); }

/*Functions*/

/**
 * Retrieves the id value in the Session variable.
 * This will be used to retrieve data.
 */
function getArtId() {
	console.log("getArtId called");
	let artId;
	if (typeof sessionStorage.getItem("FANART_ID") != 'number') {
		console.log("FANART_ID is not a number")
		sessionStorage.setItem("FANART_ID", 1);
		artId = 1;
	} else {
		console.log("FANART_ID = " + sessionStorage.getItem("FANART_ID"));
		artId = parseInt(sessionStorage.getItem("FANART_ID"));
	}
	console.log("currentArtId: " + artId);
	return artId;
}

/**
 *	Sends a GET request with an ID for a specific fanart. 
 *	The response is expected to have details specific to that fanart (i.e. url, author, etc.)
 *	Upon response, JS feeds the given information into its corresponding location
 */
function getFanart() {
	//Function Variables
	let artURL, artRequest, artResponse, idURL, idRequest, idResponse, idSeparatorIdx;

  	// Opening a connection to the server
  	console.log("Running fanartUnqJs.js with the id: " + currentArtId);
	artURL = "http:/localhost:8080/fanart/" + currentArtId;
  	console.log("artURL is: " + artURL);

  	//Making a bridge to the server through XMLHttpRequest()
  	artRequest = new XMLHttpRequest();

  	//Initializaing a request to the order
	artRequest.open("GET", artURL, true);

  	artRequest.onload = function () {
			console.log("artRequest.onload is called!");

		//Request is successful, parse the object and use it to format the page
		if (artRequest.status >= 200 && artRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + artRequest.response);
			console.log("Status Text: " + artRequest.statusText);
			artResponse = artRequest.response;
			sessionStorage.setItem("fanart_object", artResponse);

			//Parsing response into a JSON object
			artResponse = JSON.parse(artResponse);

			//Setting elements
			fanartTitle.innerHTML = artResponse.title;
			fanartAuthor.innerHTML = artResponse.author.username;
			fanartPostDate.innerHTML = artResponse.postDate;
			fanartTags.innerHTML = artResponse.tags;
			fanartImg.src = artResponse.url;

			//Retrieving Id limiters
			//Opening a new connection to the server
			idURL = "http:/localhost:8080/fanart/info/";
			console.log("idURL is: " + idURL);

			//Making a bridge to the server through XMLHttpRequest()
			idRequest = new XMLHttpRequest();

			//Initializaing a request to the order
			idRequest.open("GET", idURL, true);

			idRequest.onload = function () {
				console.log("idRequest.onload is called!");
				//Request is successful. Store the id limiters
				if (idRequest.status >= 200 && idRequest.status < 300) {
					console.log("Request was successful!");
					console.log("Response: " + idRequest.response);
					console.log("Status Text: " + idRequest.statusText);
					idResponse = idRequest.response;

					//Parse response into id values
					idSeparatorIdx = idResponse.indexOf("/");
					idLowerLimit = parseInt(idResponse.substring(0, idSeparatorIdx));
					idUpperLimit = parseInt(idResponse.substring((idSeparatorIdx + 1), idResponse.size));
					console.log("idLL: " + idLowerLimit + " | idUL: " + idUpperLimit)
					if (currentArtId == idLowerLimit) { //Id is of the first available fanart
						prevArt.hidden = true;
					} else {
						prevArt.hidden = false;
                    } 
					if (currentArtId == idUpperLimit) { //Id is of the last available fanart
						nextArt.hidden = true;
					} else {
						nextArt.hidden = false;
                    }
				} else { //Request failed. Disable nextArt and prevArt buttons
					nextArt.hidden = true;
					prevArt.hidden = true;
                }
			}
			idRequest.send();
		} else { //Request failed. Handle the error and format to default. Disable nextArt and prevArt buttons
			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			console.log(artRequest.status);
			alert(
				"FAILED: Getting Pokemon Failed!, Please Try Again or Contact Support."
			);

			//Setting elements
			fanartTitle.innerHTML = "Spheal With It!";
			fanartAuthor.innerHTML = "Leanardo Devinci";
			fanartPostDate.innerHTML = "07/06/1841";
			fanartTags.innerHTML = "spheal, leanardodevinci";
			fanartImg.src = "images/fanart/spheal.png";

			//Disabling buttons
			nextArt.hidden = true;
			prevArt.hidden = true;
		}
	};
	// Send out request
	artRequest.send();
}

/**
 *	Changes the image file between heart.png and heartEmpty.png based on the checked state
 */
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

/**
 *	Changes the image file between flag.png and flagLow.png based on the checked state
 */
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

/**Changes the page to display the previous fanart
 */
function prevArtClick() {
	console.log("prevArtClick called")
	let newArtId = currentArtId;
	let artAvailable = false;
	let prevRequest, prevResponse, prevURL;
	console.log("currentArtID: " + currentArtId + " | idLL: " + idLowerLimit)
	if (currentArtId > idLowerLimit) {
		while (newArtId >= idLowerLimit && artAvailable == false) {
			newArtId = (newArtId - 1);
			console.log("newArtID: " + newArtId + " | idLL: " + idLowerLimit)
			sessionStorage.setItem("FANART_ID", newArtId);
			prevURL = "http:/localhost:8080/fanart/info/" + newArtId;
			console.log("prevURL is: " + prevURL);

			//Making a bridge to the server through XMLHttpRequest()
			prevRequest = new XMLHttpRequest();

			//Initializaing a request to the order
			prevRequest.open("GET", prevURL, false);

			prevRequest.onload = function () {
				console.log("prevRequest.onload is called!");

				//Request is successful, make changes based on response
				if (prevRequest.status >= 200 && prevRequest.status < 300) {
					console.log("Request was successful!");
					console.log("Response: " + prevRequest.response);
					console.log("Status Text: " + prevRequest.statusText);
					prevResponse = prevRequest.response;

					if (prevResponse == 'true') { //Fanart can be shown
						currentArtId = parseInt(sessionStorage.getItem("FANART_ID"));
						getFanart();
						artAvailable = true;
					}
				} else { //Request failed. Handle errors and then default to a false response(i.e. do not break the loop)
					console.log(prevRequest.status);
                }
			}
			prevRequest.send();
        }
    }
}


/**Changes the page to display the next fanart
 */
function nextArtClick() {
	console.log("nextArtClick called")
	let newArtId = currentArtId;
	let artAvailable = false;
	let nextRequest, nextResponse, nextURL;
	console.log("currentArtID: " + currentArtId + " | idUL: " + idUpperLimit)
	if (currentArtId < idUpperLimit) {
		while (newArtId <= idUpperLimit && artAvailable == false) {
			newArtId = (newArtId + 1);
			console.log("newArtID: " + newArtId + " | idUL: " + idUpperLimit)
			sessionStorage.setItem("FANART_ID", newArtId);
			nextURL = "http:/localhost:8080/fanart/info/" + newArtId;
			console.log("nextURL is: " + nextURL);

			//Making a bridge to the server through XMLHttpRequest()
			nextRequest = new XMLHttpRequest();

			//Initializaing a request to the order
			nextRequest.open("GET", nextURL, false);

			nextRequest.onload = function () {
				console.log("nextRequest.onload is called!");

				//Request is successful, make changes based on response
				if (nextRequest.status >= 200 && nextRequest.status < 300) {
					console.log("Request was successful!");
					console.log("Response: " + nextRequest.response);
					console.log("Status Text: " + nextRequest.statusText);
					nextResponse = nextRequest.response;

					if (nextResponse == 'true') { //Fanart can be shown
						currentArtId = parseInt(sessionStorage.getItem("FANART_ID"));
						getFanart();
						artAvailable = true;
					}
				} else { //Request failed. Handle errors and then default to a false response(i.e. do not break the loop)
					console.log(nextRequest.status);
				}
			}
			nextRequest.send();
		}
	}
}
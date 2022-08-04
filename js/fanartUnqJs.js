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
let flagChk = document.getElementById('flagChk');
let prevArt = document.getElementById('prevArt');
let nextArt = document.getElementById('nextArt');
let newComment = document.getElementById('newComment');
let addComments = document.getElementById('addComments');
let allComments = document.getElementById('allComments');
let currentArtId = getArtId();
let idLowerLimit, idUpperLimit;

/*Objects*/
let artComment = {
	'fanartId': {
		'id': currentArtId
	},
	//TODO: User recognition
	/*author: {
		'id': null
	}*/
	'content': "",
	'likes': 0,
	'reports': 0,
	'isFlagged': false,
	'postDate': Date.now()
};

/*Event Listeners*/

fanartUnqBody.onload = function () { getFanart(); }
rateChk.onchange = function () { rateChkCheckChanged(rateChk.checked, 'rateImg') };
flagChk.onchange = function () { flagChkCheckChanged(flagChk.checked, 'flagImg') };
prevArt.onclick = function () { prevArtClick(); }
nextArt.onclick = function () { nextArtClick(); }
addComments.onclick = function () { postComment(); }

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
			getComments();
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
function rateChkCheckChanged(checked, imageId) {
	console.log("rateChk.onchange called");
	image = document.getElementById(imageId);
	let url = "";
	if (checked) {
		url = "images/heart.png";
	}
	else {
		url = "images/heartEmpty.png";
	}
	console.log(imageId + " src changed to" + url);
	image.src = url;
}

/**
 *	Changes the image file between flag.png and flagLow.png based on the checked state
 */
function flagChkCheckChanged(checked, imageId) {
	console.log("rateChk.onchange called");
	image = document.getElementById(imageId);
	let url = '';
	if (checked) {
		url = 'images/flag.png';
	}
	else {
		url = 'images/flagLow.png';
	}
	console.log(imageId + " src changed to" + url);
	image.src = url;
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

/**Retrieves comments associated with the shown fanart
 * */
function getComments() {
	console.log("getComments called")
	let getCommRequest, getCommResponse, getCommURL,
		newComm, newCommText, newCommAuthor,
		newCommLike, newCommLikeLbl, newCommLikeImg,
		newCommReport, newCommReportLbl, newCommReportImg;

	//Setup request
	getCommRequest = new XMLHttpRequest();

	getCommURL = "http:/localhost:8080/artcomm/" + currentArtId;

	getCommRequest.open("GET", getCommURL, true);

	getCommRequest.onload = function () {
		console.log("getCommRequest.onload called");

		//Request is successful. Add comment objects to the html
		if (getCommRequest.status >= 200 && getCommRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + getCommRequest.response);
			console.log("Status Text: " + getCommRequest.statusText);
			getCommResponse = JSON.parse(getCommRequest.response);
			allComments.innerHTML = null;

			for (let commentObj of getCommResponse) {
				//Reset variables
				newComm = null;
				newCommText = null;
				newCommAuthor = null;
				newCommLike = null;
				newCommLikeLbl = null;
				newCommLikeImg = null;
				newCommReport = null;
				newCommReportLbl = null;
				newCommReportImg = null;

				//Creating new elements
				newComm = document.createElement('div');
				newCommAuthor = document.createElement('p');
				newCommText = document.createElement('p');
				newCommLike = document.createElement('input');
				newCommLikeImg = document.createElement('img');
				newCommLikeLbl = document.createElement('label');
				newCommReport = document.createElement('input');
				newCommReportImg = document.createElement('img');
				newCommReportLbl = document.createElement('label');

				//Adding Elements to NewComm
				newComm.appendChild(newCommAuthor);
				newComm.appendChild(newCommText);
				newComm.appendChild(newCommLike);
				newComm.appendChild(newCommLikeLbl);
				newComm.appendChild(newCommReport);
				newComm.appendChild(newCommReportLbl);

				//Adding NewComm to allComments
				allComments.appendChild(newComm);

				//Setting up a new div
				newComm.setAttribute("class", "loadedComment");

				//Setting up author label
				newCommAuthor.setAttribute("class", "commentAuthor")
				if (commentObj.author == null) {
					newCommAuthor.innerHTML = "Anonymous";
				} else {
					newCommAuthor.innerHTML = commentObj.author.username;
				}

				//Setting up comment text
				newCommText.setAttribute("class", "commentText");
				newCommText.innerHTML = commentObj.content;

				//Setting up like button
				newCommLike.setAttribute("class", "commentLike");
				newCommLike.setAttribute("id", "Like" + commentObj.id);
				newCommLike.type = "checkbox";

				//Setting up image for like button
				newCommLikeImg.src = "images/heartEmpty.png";
				newCommLikeImg.setAttribute("class", "commentLikeImg");
				newCommLikeImg.setAttribute("id", "LikeImg" + commentObj.id);
				newCommLikeImg.height = "32";
				newCommLikeImg.width = "32";

				//Setting up label for like button
				newCommLikeLbl.setAttribute("class", "commentLikeLbl");
				newCommLikeLbl.setAttribute("for", newCommLike.id);
				newCommLikeLbl.appendChild(newCommLikeImg);

				//Setting up report button
				newCommReport.setAttribute("class", "commentReport");
				newCommReport.setAttribute("id", "Report" + commentObj.id);
				newCommReport.type = "checkbox";

				//Setting up image for report button
				newCommReportImg.src = "images/flagLow.png";
				newCommReportImg.setAttribute("class", "commentReportImg");
				newCommReportImg.setAttribute("id", "ReportImg" + commentObj.id);
				newCommReportImg.height = "32";
				newCommReportImg.width = "32";

				//Setting up label for report button
				newCommReportLbl.setAttribute("class", "commentReportLbl");
				newCommReportLbl.setAttribute("for", newCommReport.id);
				newCommReportLbl.appendChild(newCommReportImg);

				console.log("New div created");

				//Setting event listeners
				console.log("New Like Image: " + newCommLikeImg.id);
				console.log("New Report Image: " + newCommReportImg.id);
				newCommLike.onchange = function () {
					rateChkCheckChanged(document.getElementById("Like" + commentObj.id).checked, "LikeImg" + commentObj.id)
				}
				newCommReport.onchange = function () {
					flagChkCheckChanged(document.getElementById("Report" + commentObj.id).checked, "ReportImg" + commentObj.id)
				}
			}
		} else { //Request failed. Handle errors and default to no comments
			console.log(getCommRequest.statusText);
		}
	}
	//Send the request
	getCommRequest.send();
}

function postComment() {
	let postComm, postCommJSON, postURL, postRequest;

	//Creating object for request body
	postComm = artComment;
	postComm.content = newComment.value;
	postCommJSON = JSON.stringify(postComm);
	console.log(newComment.value);
	console.log(postCommJSON);
	//TODO: User recognition
	//postComm.author.id = null

	//Setting up request
	postURL = "http:/localhost:8080/artcomm/create";
	postRequest = new XMLHttpRequest();
	postRequest.open("POST", postURL, true);
	postRequest.setRequestHeader('Content-Type', 'application/json');

	postRequest.onload = function () {
		console.log("postRequest.onload is called!");

		//Request is successful, update the comments
		if (postRequest.status >= 200 && postRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + postRequest.response);
			console.log("Status Text: " + postRequest.statusText);
			getComments();
		} else { //Request failed. Handle errors
			console.log(postRequest.statusText);
			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			alert(
				"FAILED: Comment failed to post. Please Try Again or Contact Support."
			);
		}
	}
	//Send request
	postRequest.send(postCommJSON);
}
console.log("Loaded fanartUnqJs.js");

/*Script Variables*/

let fanartUnqBody = document.getElementById("fanartUnqBody");
let loginLink = document.getElementById("loginLink");
let loggedUN = document.getElementById("loggedUN");
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
let currentUserId = getUserId();
let idLowerLimit, idUpperLimit;

/*JSON Objects*/

let userIdDto = {
	'id': 1
};

let fanartDto = {
	'id': currentArtId
};

let artCommDto = {
	'id': null
};

let artComment = {
	'fanartId': {
		'id': currentArtId
	},
	//TODO: User recognition
	author: userIdDto,
	'content': "",
	'likes': 0,
	'reports': 0,
	'isFlagged': false,
	'postDate': Date.now()
};

let rateArt = {
	'id': null,
	'fanartId': fanartDto,
	'author': userIdDto,
	'isLiked': true
};

let rateArtComm = {
	'id': null,
	'commentId': artCommDto,
	'author': userIdDto,
	'isLiked': true
};

let reportArt = {
	'id': null,
	'fanartId': fanartDto,
	'author': userIdDto,
	'isReported': false,
	'reportReason': "Explicit/ Offensive Content"
};

let reportArtComm = {
	'id': null,
	'commentId': artCommDto,
	'author': userIdDto,
	'isReported': false,
	'reportReason': "Explicit/ Offensive Content"
};

/*Event Listeners*/

fanartUnqBody.onload = function () { getFanart(); }
rateChk.onchange = function () { rateChkCheckChanged('rateChk', 'rateImg', 'art') };
flagChk.onchange = function () { flagChkCheckChanged('flagChk', 'flagImg', 'art') };
prevArt.onclick = function () { prevArtClick(); }
nextArt.onclick = function () { nextArtClick(); }
addComments.onclick = function () { postComment(); }

/*Functions*/

/**
 * Retrieves the art id value in the Session variable.
 * This will be used to retrieve and post data.
 */
function getArtId() {
	console.log("getArtId called");
	let artId;
	if (typeof sessionStorage.getItem("FANART_ID") == 'undefined') {
		console.log("FANART_ID is not a number")
		sessionStorage.setItem("FANART_ID", 44);//44 is the first fanart in the DB
		artId = 44;
	} else {
		console.log("FANART_ID = " + sessionStorage.getItem("FANART_ID"));
		artId = parseInt(sessionStorage.getItem("FANART_ID"));
	}
	console.log("currentArtId: " + artId);
	return artId;
}

/**
 * Retrieves the user id value in the Session variable.
 * This will be used to retrieve and post data.
 */
function getUserId() {
	console.log("getUserId called");
	let userId = null;
	if (typeof sessionStorage.getItem("USER_ID") == 'undefined') {
		loginLink.hidden = false;
		loggedUN.hidden = true;
	} else {
		loginLink.hidden = true;
		loggedUN.hidden = true;
		loggedUN.innerHTML = sessionStorage.getItem("USERNAME");
		console.log("USER_ID = " + sessionStorage.getItem("USER_ID"));
		userId = parseInt(sessionStorage.getItem("USER_ID"));
		console.log("currentUserId: " + userId);
	}
	return userId;
}

/**
 *	Sends a GET request with an ID for a specific fanart. 
 *	The response is expected to have details specific to that fanart (i.e. url, author, etc.)
 *	Upon response, JS feeds the given information into its corresponding location
 */
function getFanart() {
	//Function Variables
	let artURL, artRequest, artResponse,
		idURL, idRequest, idResponse, idSeparatorIdx,
		rateURL, rateRequest, rateResponse, rateUser,
		reportURL, reportRequest, reportResponse, reportUser;

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
					console.log(idRequest.statusText);
					nextArt.hidden = true;
					prevArt.hidden = true;
                }
			}

			//Retrieving rate on fanart by user
			//Setup request
			rateURL = "http:/localhost:8080/rateart?artId=" + currentArtId + "&userId=" + currentUserId;
			console.log("rateURL: " + rateURL);
			rateRequest = new XMLHttpRequest();
			rateRequest.open("GET", rateURL, true);
			rateRequest.setRequestHeader("Content-Type", "application/json");

			//Setup request body
			rateUser = userIdDto;
			rateUser.id = currentUserId;

			rateRequest.onload = function () {
				console.log("rateRequest.onload called");

				//Request is successful. Update the relevant checkbox
				if (rateRequest.status >= 200 && rateRequest.status < 300) {
					console.log("Request was successful!");
					console.log("Response: " + rateRequest.response);
					console.log("Status Text: " + rateRequest.statusText);
					rateResponse = rateRequest.response;
					rateResponse = JSON.parse(rateResponse);
					try {
						if (rateResponse.isLiked) {
							rateChk.checked = true;
							rateImg.src = "images/heart.png"
						} else {
							rateChk.checked = false;
						}
					} catch {
						console.log("Null response");
                    }
				} else { //Request failed. Handle errors
					console.log(rateRequest.statusText);
                }
			}

			//Retrieving report on fanart by user
			//Setup request
			reportURL = "http:/localhost:8080/reportart?artId=" + currentArtId + "&userId=" + currentUserId;
			console.log("reportURL: " + reportURL);
			reportRequest = new XMLHttpRequest();
			reportRequest.open("GET", reportURL, true);
			reportRequest.setRequestHeader("Content-Type", "application/json");

			reportRequest.onload = function () {
				console.log("reportRequest.onload called");

				//Request is successful. Update the relevant checkbox
				if (reportRequest.status >= 200 && reportRequest.status < 300) {
					console.log("Request was successful!");
					console.log("Response: " + reportRequest.response);
					console.log("Status Text: " + reportRequest.statusText);
					reportResponse = reportRequest.response;
					reportResponse = JSON.parse(reportResponse);
					try {
						if (reportResponse.isReported) {
							flagChk.checked = true;
							flagImg.src = "images/flag.png"
						} else {
							flagChk.checked = false;
						}
					} catch {
						console.log("Null response");
					}
				} else { //Request failed. Handle errors
					console.log(reportRequest.statusText);
				}
			}

			//Send Requests
			rateRequest.send();
			reportRequest.send();
			idRequest.send();
			getComments();
		} else { //Request failed. Handle the error and format to default. Disable nextArt and prevArt buttons
			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			console.log(artRequest.statusText);
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
 *	Changes the image file between heart.png and heartEmpty.png and saves to the database based on the checked state
 */
function rateChkCheckChanged(chkId, imageId, type){
	console.log("rateChkCheckChanged called");
	image = document.getElementById(imageId);
	chk = document.getElementById(chkId);
	let imgURL, postURL, postRequest, postUser, postBody;

	//Setup postURL and postBody
	if (type == 'art') {
		postURL = "http:/localhost:8080/rateart/";
		postBody = rateArt;
		postBody.fanartId.id = currentArtId
	} else if (type == 'comment') {
		let commentId = chkId.substring(4);//Naming convention for comments is Like{id}. Getting comment id by removing "Like"
		console.log("CommID: " + commentId);
		postURL = "http:/localhost:8080/rateartcomm/";
		postBody = rateArtComm;
		postBody.commentId = parseInt(commentId);
	}
	postUser = userIdDto;
	//TODO User Recognition
	postUser.id = currentUserId;
	postBody.author = postUser;
	postBody.isLiked = chk.checked
	postBody = JSON.stringify(postBody);
	console.log(postBody);

	//Setup request
	postRequest = new XMLHttpRequest();
	postRequest.open("POST", postURL, true);
	postRequest.setRequestHeader("Content-Type", "application/json");

	postRequest.onload = function () {
		//Request is successful. Change image to reflect
		if (postRequest.status >= 200 && postRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + postRequest.response);
			console.log("Status Text: " + postRequest.statusText);
			if (chk.checked) {
				imgURL = "images/heart.png";
			}
			else {
				imgURL = "images/heartEmpty.png";
			}
			console.log(imageId + " src changed to" + imgURL);
			image.src = imgURL;
		} else { //Request failed. Handle errors
			console.log(postRequest.statusText);

			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			alert(
				"FAILED: Rating failed to post. Please Try Again or Contact Support."
			);
        }
	}
	//Send request
	postRequest.send(postBody);
}

/**
 *	Changes the image file between flag.png and flagLow.png and saves to the database based on the checked state
 */
function flagChkCheckChanged(chkId, imageId, type) {
	console.log("flagChkCheckChanged called");
	image = document.getElementById(imageId);
	chk = document.getElementById(chkId);
	let imgURL, postURL, postRequest, postUser, postBody;

	//TODO prompt user for report reason

	//Setup postURL and postBody
	if (type == 'art') {
		postURL = "http:/localhost:8080/reportart/";
		postBody = reportArt;
		postBody.fanartId.id = currentArtId
	} else if (type == 'comment') {
		let commentId = chkId.substring(6);//Naming convention for comments is Report{id}. Getting comment id by removing "Like"
		console.log("CommID: " + commentId);
		postURL = "http:/localhost:8080/reportartcomm/";
		postBody = reportArtComm;
		postBody.commentId = parseInt(commentId);
	}
	postUser = userIdDto;
	//TODO User Recognition
	postUser.id = currentUserId;
	postBody.author = postUser;
	postBody.isReported = chk.checked
	postBody = JSON.stringify(postBody);
	console.log(postBody);

	//Setup request
	postRequest = new XMLHttpRequest();
	postRequest.open("POST", postURL, true);
	postRequest.setRequestHeader("Content-Type", "application/json");

	postRequest.onload = function () {
		//Request is successful. Change image to reflect
		if (postRequest.status >= 200 && postRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + postRequest.response);
			console.log("Status Text: " + postRequest.statusText);
			if (chk.checked) {
				imgURL = "images/flag.png";
			}
			else {
				imgURL = "images/flagLow.png";
			}
			console.log(imageId + " src changed to" + imgURL);
			image.src = imgURL;
		} else { //Request failed. Handle errors
			console.log(postRequest.statusText);

			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			alert(
				"FAILED: Rating failed to post. Please Try Again or Contact Support."
			);
		}
	}
	//Send request
	postRequest.send(postBody);
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

					if (nextResponse == 'true') { //Fanart can be shown. Set checkboxes to unchecked
						rateChk.checked = false;
						rateImg.src = "images/heartEmpty.png";
						flagChk.checked = false;
						flagImg.src = "images/flagLow.png";
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
 */
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
				newCommLike.setAttribute("id" ,"Like" + commentObj.id);
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
				newCommReportImg.setAttribute("class","commentReportImg");
				newCommReportImg.setAttribute("id","ReportImg" + commentObj.id);
				newCommReportImg.height = "32";
				newCommReportImg.width = "32";

				//Setting up label for report button
				newCommReportLbl.setAttribute("class", "commentReportLbl");
				newCommReportLbl.setAttribute("for",newCommReport.id);
				newCommReportLbl.appendChild(newCommReportImg);

				//Retrieving rate on comment by user
				//Setup request
				rateURL = "http:/localhost:8080/rateartcomm?commId=" + commentObj.id + "&userId=" + currentUserId;
				console.log("rateURL: " + rateURL);
				rateRequest = new XMLHttpRequest();
				rateRequest.open("GET", rateURL, false);
				rateRequest.setRequestHeader("Content-Type", "application/json");

				//Setup request body
				rateUser = userIdDto;
				rateUser.id = currentUserId;

				rateRequest.onload = function () {
					console.log("rateRequest.onload called");

					//Request is successful. Update the relevant checkbox
					if (rateRequest.status >= 200 && rateRequest.status < 300) {
						console.log("Request was successful!");
						console.log("Response: " + rateRequest.response);
						console.log("Status Text: " + rateRequest.statusText);
						rateResponse = rateRequest.response;
						rateResponse = JSON.parse(rateResponse);
						try {
							if (rateResponse.isLiked) {
								newCommLike.checked = true;
								newCommLikeImg.src = "images/heart.png"
							}
						} catch {
							console.log("Null response")
                        }
					} else { //Request failed. Handle errors
						console.log(rateRequest.statusText);
					}
				}

				//Retrieving report on fanart by user
				//Setup request
				reportURL = "http:/localhost:8080/reportartcomm?commId=" + commentObj.id + "&userId=" + currentUserId;
				console.log("reportURL: " + reportURL);
				reportRequest = new XMLHttpRequest();
				reportRequest.open("GET", reportURL, false);
				reportRequest.setRequestHeader("Content-Type", "application/json");

				reportRequest.onload = function () {
					console.log("reportRequest.onload called");

					//Request is successful. Update the relevant checkbox
					if (reportRequest.status >= 200 && reportRequest.status < 300) {
						console.log("Request was successful!");
						console.log("Response: " + reportRequest.response);
						console.log("Status Text: " + reportRequest.statusText);
						reportResponse = reportRequest.response
						reportResponse = JSON.parse(reportResponse);
						try {
							if (!reportResponse.body == null) {
								if (reportResponse.isReported) {
									newCommReport.checked = true;
									newCommReportImg.src = "images/flag.png"
								}
							}
						} catch {
							console.log("Null response")
						}
					} else { //Request failed. Handle errors
						console.log(reportRequest.statusText);
					}
				}

				//Send Requests
				rateRequest.send();
				reportRequest.send();

				console.log("New div created");

				//Setting event listeners
				console.log("New Like Image: " + newCommLikeImg.id);
				console.log("New Report Image: " + newCommReportImg.id);
				newCommLike.onchange = function () {
					rateChkCheckChanged("Like" + commentObj.id, "LikeImg" + commentObj.id, 'comment')
				}
				newCommReport.onchange = function () {
					flagChkCheckChanged("Report" + commentObj.id, "ReportImg" + commentObj.id, 'comment')
				}
            }
		} else { //Request failed. Handle errors and default to no comments
			console.log(getCommRequest.statusText);
        }
	}
	//Send the request
	getCommRequest.send();
}

/** Saves a comment to the database based on the fanart's id and the user's id
 */
function postComment() {
	let postComm, postCommJSON, postURL, postRequest, postUser;

	//Creating object for request body
	postComm = artComment;
	postUser = userIdDto;
	//TODO: User recognition
	postUser.id = currentUserId;
	postComm.content = newComment.value;
	postCommJSON = JSON.stringify(postComm);
	console.log(newComment.value);
	console.log(postCommJSON);

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
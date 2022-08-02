console.log("Loaded fanartUnqJs.js");

/*Script Variables*/
let fanartBody = document.getElementById("fanartBody")
let imageDisplay = document.getElementById("imageDisplay");
let pgLftBtn = document.getElementById("pgLftBtn");
let pgRgtBtn = document.getElementById("pgRgtBtn");

/*Event Listeners*/
fanartBody.onload = getFanart();

/*Functions*/

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
 */
function getFanart() {
	console.log("getFanart called")
	let getArtRequest, getArtResponse, getArtURL,
		newArt, newArtTitle, newArtAuthor, newArtImg;

	//Setup request
	getArtRequest = new XMLHttpRequest();

	getArtURL = "http:/localhost:8080/fanart/";

	getArtRequest.open("GET", getArtURL, false);

	getArtRequest.onload = function () {
		console.log("getArtRequest.onload called");

		//Request is successful. Add fanart objects to the html
		if (getArtRequest.status >= 200 && getArtRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + getArtRequest.response);
			console.log("Status Text: " + getArtRequest.statusText);
			getArtResponse = JSON.parse(getArtRequest.response);
			imageDisplay.innerHTML = null;

			for (let fanartObj of getArtResponse) {
				//Reset variables
				newArt = null;
				newArtTitle = null;
				newArtAuthor = null;

				//Creating new elements
				newArt = document.createElement('div');
				newArtTitle = document.createElement('p');
				newArtImg = document.createElement('img');
				newArtAuthor = document.createElement('p');

				//Adding Elements to NewArt
				newArt.appendChild(newArtTitle);
				newArt.appendChild(newArtImg);
				newArt.appendChild(newArtAuthor);

				//Adding NewComm to allComments
				imageDisplay.appendChild(newArt);

				//Setting up a new div
				newArt.setAttribute("class", "loadedFanart");
				newArt.setAttribute("id", fanartObj.id);

				//Setting up author label
				newArtAuthor.setAttribute("class", "fanartAuthor")
				if (fanartObj.author == null) {
					newArtAuthor.innerHTML = "Anonymous";
				} else {
					newArtAuthor.innerHTML = fanartObj.author.username;
                }

				//Setting up title label
				newArtTitle.setAttribute("class", "fanartTitle");
				newArtTitle.innerHTML = fanartObj.title;

				//Setting up fanart image
				newArtImg.src = fanartObj.url;
				newArtImg.setAttribute("class", "fanartImg");
				newArtImg.setAttribute("id", "Img" + fanartObj.id);
				newArtImg.height = "100";
				newArtImg.width = "100";

				//Setting event listeners
            }
		} else { //Request failed. Handle errors and default to no comments
			console.log(getArtRequest.statusText);
        }
	}
	//Send the request
	getArtRequest.send();
}
console.log("Loaded fanartUnqJs.js");

/*Script Variables*/

let fanartBody = document.getElementById("fanartBody")
let imageDisplay = document.getElementById("imageDisplay");
let pgLftBtn = document.getElementById("pgLftBtn");
let pgRgtBtn = document.getElementById("pgRgtBtn");
let storedFanart = new List();

/*Objects*/

/** Full Disclosure: This is a modified copy of a list model from
 * https://learnersbucket.com/tutorials/data-structures/list-data-structure-in-javascript/
 * because I couldn't be bothered to make this myself - Barry Norton
 */
function List() {
    //Initialize the list
    this.listSize = 0;
    this.pos = 0;
    this.items = [];

    //Add item to the list
	this.append = (element) => {
		console.log("List.append called: Added " + element);
        this.items[this.listSize++] = element;
    }

    //Get current item from the list
	this.getElement = (index) => {
		console.log("List.getElement(" + index + ") called: Returned " + this.items[index]);
        return this.items[index];
    }

    //Get the size list
	this.size = () => {
		console.log("List.size called: Returned " + this.listSize);
        return this.listSize;
    }

    //Clear the list
	this.clear = () => {
		console.log("List.clear called");
        this.listSize = 0;
        this.pos = 0;
        this.items = [];
    }
}

/*Event Listeners*/
fanartBody.addEventListener("load", getAllFanart());
fanartBody.addEventListener("load", displayPage(0));

/*Functions*/

/**Retrieves comments associated with the shown fanart
 */
function getAllFanart() {
	console.log("getFanart called")
	let getArtRequest, getArtResponse, getArtURL;

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
			storedFanart.clear();

			for (let fanartObj of getArtResponse) {
				storedFanart.append(fanartObj);
			}
				
		} else { //Request failed. Handle errors and default to no comments
			console.log(getArtRequest.statusText);
        }
	}
	//Send the request
	getArtRequest.send();
}

/**Displays a set of 10 or fewer fanarts based on the given page number
 */
function displayPage(pageNum) {
	//Function Variables
	let startIdx = (10 * pageNum);
	let endIdx = startIdx + 9;
	let fanartSize = storedFanart.size();
	let newArt, newArtTitle, newArtAuthor, newArtImg, newArtLink;

	//Empty imageDisplay
	imageDisplay.innerHTML = null;

	for (let i = startIdx; i <= endIdx && i < fanartSize; i++) {
		fanartObj = null;
		fanartObj = storedFanart.getElement(i);

		//Reset variables
		newArt = null;
		newArtTitle = null;
		newArtAuthor = null;

		//Creating new elements
		newArt = document.createElement('div');
		newArtTitle = document.createElement('p');
		newArtImg = document.createElement('img');
		newArtAuthor = document.createElement('p');

		//Adding Elements to newArt
		newArt.appendChild(newArtTitle);
		newArt.appendChild(newArtImg);
		newArt.appendChild(newArtAuthor);

		//Adding newArt to imageDisplay
		imageDisplay.appendChild(newArt);

		//Setting up newArt. Giving it a class based on the id being even/odd
		if (fanartObj.id % 2 == 0) {
			newArt.setAttribute("class", "ArtDisplayLft");
		} else {
			newArt.setAttribute("class", "ArtDisplayRgt");
        }
		newArt.setAttribute("id", "Art" + fanartObj.id);

		//Setting up newArtAuthor
		newArtAuthor.setAttribute("class", "fanartAuthor")
		if (fanartObj.author == null) {
			newArtAuthor.innerHTML = "Anonymous";
		} else {
			newArtAuthor.innerHTML = fanartObj.author.username;
		}

		//Setting up newArtTitle
		newArtTitle.setAttribute("class", "fanartTitle");
		newArtTitle.innerHTML = fanartObj.title;

		//Setting up newArtImg
		newArtImg.src = fanartObj.url;
		newArtImg.setAttribute("class", "fanartImg");
		newArtImg.setAttribute("id", "Img" + fanartObj.id);
		newArtImg.height = "100";
		newArtImg.width = "100";

		//Setting event listeners
		newArtImg.onclick = function () { setFanartId(storedFanart.getElement(i).id) }

		console.log("New div created: " + newArt.id)
	}
}

/**Sets the session storage variable "FANART_ID" to be referenced by fanartUnq.html
 * @param {any} id
 */
function setFanartId(id) {
	console.log("setFanartId(" + id + ") called");
	sessionStorage.setItem("FANART_ID", id);
	return window.location.href = "fanartUnq.html";
}
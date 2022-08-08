console.log("Loaded fanartUnqJs.js");

/*Script Variables*/

let fanartBody = document.getElementById("fanartBody");
let logImg = document.getElementById("log-img");
let filterSlct = document.getElementById("filterSlct");
let filterTxtBx = document.getElementById("filterTxtBx");
let filterDateCal = document.getElementById("filterDateCal");
let filterTxtBxLbl = document.getElementById("filterTxtBxLbl");
let filterDateCalLbl = document.getElementById("filterDateCalLbl");
let applyFiltersBtn = document.getElementById("applyFiltersBtn");
let imageDisplay = document.getElementById("imageDisplay");
let pgLftBtn = document.getElementById("pgLftBtn");
let pgTitleLbl = document.getElementById('pgTitleLbl');
let pgRgtBtn = document.getElementById("pgRgtBtn");
let storedFanart = new List();
let loggedIn = sessionStorage.getItem("USER_ID");
let logInImage = "images/log-in.png";
let logOutImage = "images/Log-Out.png";
let currentUserId = getUserId();
let lastPage;
let currentPage;

/*Objects*/

/** Full Disclosure: This is a modified copy of a list model from
 * https://learnersbucket.com/tutorials/data-structures/list-data-structure-in-javascript/
 * because I couldn't be bothered to make this myself - Barry Norton
 */
function List() {
    //Initialize the list
    this.listSize = 0;
	this.pos = 0;
	this.pgCount = 0;
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

	//Determine page count for the list
	this.pages = () => {
		if (this.listSize % 10 == 0) {//ListSize can be divided evenly by 10
			//Subtracting by 1 because of how the variable is used. 
			//A List with only 10 fanarts would only display on one page,
			//but leaving pgCount as 1 would allow pgRgtBtn to show, 
			//implying that there is another page to display
			this.pgCount = (this.listSize / 10) - 1;
		} else {
			//Math.floor omits the decimal value(unless it is a negative number),
			//A list with greater than 1 and less than 10 fanarts would still need one page to display,
			//but Math floor would return zero in that case.
			//However, that is the value needed in this case,
			//although the true page count is 1
			this.pgCount = Math.floor(this.listSize / 10);
		}
		console.log("List.pages called: Returned " + this.pgCount);
		return this.pgCount;
	}
}

/*Event Listeners*/
fanartBody.addEventListener("load", getAllFanart());
fanartBody.addEventListener("load", displayPage(0));
fanartBody.addEventListener("load", displayFilterInput());
filterSlct.onchange = function () { displayFilterInput(); };
applyFiltersBtn.addEventListener("click", function () { getFilteredFanart(); });
pgLftBtn.addEventListener("click", function () { displayPage((currentPage - 1)); });
pgRgtBtn.addEventListener("click", function () { displayPage((currentPage + 1)); });
logImg.onclick = function () { logStateChange(); }

/*Functions*/

/**
 * Retrieves the user id value in the Session variable.
 * This will be used to retrieve and post data.
 */
function getUserId() {
	console.log("getUserId called");
	let userId = null;
	if (loggedIn) {
		loggedIn = true;
		logImg.src = logOutImage;
		console.log("USER_ID = " + sessionStorage.getItem("USER_ID"));
		userId = parseInt(sessionStorage.getItem("USER_ID"));
		console.log("currentUserId: " + userId);
		createUsernameLabel(sessionStorage.getItem("USERNAME"));
	} else {
		loggedIn = false;
		logImg.src = logInImage;
	}
	return userId;
}

/**Logs a user out or sends them to the login page based on loggedIn status
 */
function logStateChange() {
	if (loggedIn) { //User is logged in. Will log them out
		sessionStorage.removeItem("USER_ID");
		logImg.src = "images/log-in.png";
		loggedIn = false;
		currentUserId = null;
		const htmlBody = document.getElementsByTagName("body")[0];
		htmlBody.removeChild(document.getElementById("userDivAnchor"));
	} else { //User is not logged in. Will link them to login.html
		window.location.href = "login.html";
	}
}

function createUsernameLabel(username) {
	if (loggedIn) {
		console.log("Creating username label!");
		// Grab target div
		const targetDiv = document.getElementsByClassName("navContainer")[0];
		const userDiv = document.createElement("div");
		userDiv.id = "userDiv";

		const usernameLabel = username;
		const titleLine = document.createElement("p");
		const titleText = document.createTextNode("Logged in as " + usernameLabel);
		const profileLink = document.createElement("a");
		profileLink.href = "profile.html";
		profileLink.id = "userDivAnchor";
		titleLine.appendChild(titleText);
		userDiv.appendChild(titleLine);
		profileLink.appendChild(userDiv);
		targetDiv.after(profileLink);
	}
}

/**Retrieves all available fanart
 */
function getAllFanart() {
	console.log("getAllFanart called")
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

/**Retrieves all available fanart that aligns with the given filter
 */
function getFilteredFanart() {
	console.log("getFilteredFanart called")
	let getFilteredArtRequest, getFilteredArtResponse, getFilteredArtURL,
		filterKey, filterParams;

	//Setup filterparams
	filterKey = filterSlct.value;
	filterParams = filterKey;

	if (filterKey.includes("date")) { //The date filter uses filterDateCal
		filterParams = filterParams + "=" + filterDateCal.value;
	} else { //Otherwise, filterTxtBx is used
		filterParams = filterParams + "=" + filterTxtBx.value;
	}
	console.log("Filters: " + filterParams);

	//Setup request
	getFilteredArtRequest = new XMLHttpRequest();

	getFilteredArtURL = "http:/localhost:8080/fanart/filters?" + filterParams;

	getFilteredArtRequest.open("GET", getFilteredArtURL, false);

	getFilteredArtRequest.onload = function () {
		console.log("getFilteredArtRequest.onload called");

		//Request is successful. Add fanart objects to the html
		if (getFilteredArtRequest.status >= 200 && getFilteredArtRequest.status < 300) {
			console.log("Request was successful!");
			console.log("Response: " + getFilteredArtRequest.response);
			console.log("Status Text: " + getFilteredArtRequest.statusText);
			getFilteredArtResponse = JSON.parse(getFilteredArtRequest.response);
			storedFanart.clear();

			for (let fanartObj of getFilteredArtResponse) {
				storedFanart.append(fanartObj);
			}

		} else { //Request failed. Handle errors and default to no comments
			console.log(getFilteredArtRequest.statusText);
		}
	}
	//Send the request
	getFilteredArtRequest.send();
	displayPage(0);
}

/**Displays a set of 10 or fewer fanarts based on the given page number
 */
function displayPage(pageNum) {
	//Function Variables
	let startIdx = (10 * pageNum);
	let endIdx = startIdx + 9;
	let fanartSize = storedFanart.size();
	let lastPage = storedFanart.pages();
	let newArt, newArtTitle, newArtAuthor, newArtImg;

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
		if (i % 2 == 0) {
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
		newArtImg.height = "250";
		newArtImg.width = "250";

		//Setting event listeners
		newArtImg.onclick = function () { setFanartId(storedFanart.getElement(i).id) }

		console.log("New div created: " + newArt.id)
	}

	//Setting currentPage
	currentPage = pageNum;

	//Setting page label
	pgTitleLbl.innerHTML = "Page " + (pageNum + 1) + " of " + (lastPage + 1);

	//Hiding buttons based on first and last page
	//pgLftBtn
	if (pageNum <= 0) {//Page displayed is the first page
		pgLftBtn.hidden = true;
	} else {
		pgLftBtn.hidden = false;
	}
	//pgRgtBtn
	if (pageNum >= lastPage) {//Page displayed is the last page
		pgRgtBtn.hidden = true;
	} else {
		pgRgtBtn.hidden = false;
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

function displayFilterInput() {
	console.log("displayFilterInput called");
	let filterKey = filterSlct.value;
	if (filterKey.includes("date")) { //The date filter uses filterDateCal
		filterTxtBx.hidden = true;
		filterTxtBxLbl.hidden = true;
		filterDateCal.hidden = false;
		filterDateCalLbl.hidden = false;
		console.log("Showing date filters");
	} else { //Otherwise, filterTxtBx is used
		filterTxtBx.hidden = false;
		filterTxtBxLbl.hidden = false;
		filterDateCal.hidden = true;
		filterDateCalLbl.hidden = true;
		console.log("Showing text filters");
    }
}
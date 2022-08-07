console.log("Loaded fanartUnqJs.js");

/*Script Variables*/

let fanartUnqBody = document.getElementById("fanartUnqBody");
let logImg = document.getElementById("log-img");
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
let rateCommChks = document.getElementsByClassName('commentLike');
let rateCommImgs = document.getElementsByClassName('commentLikeImg');
let reportCommChks = document.getElementsByClassName('commentReport');
let reportCommImgs = document.getElementsByClassName('commentReportImg');
let loggedIn = false;
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
    'author': userIdDto,
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

fanartUnqBody.onload = function () { getFanart(); };
rateChk.onchange = function () { rateChkCheckChanged('rateChk', 'rateImg', 'art'); };
flagChk.onchange = function () { flagChkCheckChanged('flagChk', 'flagImg', 'art'); };
prevArt.onclick = function () { prevArtClick(); };
nextArt.onclick = function () { nextArtClick(); };
addComments.onclick = function () { postComment(); };
logImg.onclick = function () { logStateChange(); }

/*Functions*/

/**
 * Retrieves the art id value in the Session variable.
 * This will be used to retrieve and post data.
 */
function getArtId() {
    console.log("getArtId called");
    let artId;
    if (sessionStorage.getItem("FANART_ID") == null) {
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
    if (sessionStorage.getItem("USER_ID") == null) {
        loggedIn = false;
        logImg.src = "images/log-in.png";
    } else {
        loggedIn = true;
        logImg.src = "images/Log-Out.png";
        console.log("USER_ID = " + sessionStorage.getItem("USER_ID"));
        userId = parseInt(sessionStorage.getItem("USER_ID"));
        console.log("currentUserId: " + userId);
    }
    return userId;
}

/**Logs a user out or sends them to the login page based on loggedIn status
 */
function logStateChange() {
    console.log("logStateChange called");
    if (loggedIn) { //User is logged in. Will log them out
        //Clearing session variables
        sessionStorage.removeItem("USER_ID");
        sessionStorage.removeItem("USERNAME");
        sessionStorage.removeItem("JWT");

        //Reseting script variables
        loggedIn = false;
        currentUserId = null;

        //Reseting page display
        //Art Ratings
        rateChk.checked = false;
        rateImg.src = "images/heartEmpty.png";
        flagChk.checked = false;
        flagImg.src = "images/flagLow.png";

        //Comment Ratings
        //Checkboxes
        for (let commentChk of rateCommChks) {
            commentChk.checked = false;
        }
        for (let commentChk of reportCommChks) {
            commentChk.checked = false;
        }

        //Images
        for (commentImg of rateCommImgs) {
            commentImg.src = "images/heartEmpty.png";
        }
        for (commentImg of reportCommImgs) {
            commentImg.src = "images/flagLow.png";
        }

        //Login image
        logImg.src = "images/log-in.png";

        //Alerting user
        alert(
            "You have been logged out"
        );
        console.log("User logged out");
    } else { //User is not logged in. Will link them to login.html
        window.location.href = "login.html";
    }
}

/**
 *	Sends a GET request with an ID for a specific fanart. 
 *	The response is expected to have details specific to that fanart (i.e. url, author, etc.)
 *	Upon response, JS feeds the given information into its corresponding location
 */
function getFanart() {
    //Function Variables
    let artURL, artResponse,
        idURL, idResponse, idSeparatorIdx,
        rateURL, rateResponse, rateUser,
        reportURL, reportResponse, reportUser;

    // Setting Up URL
    artURL = "http:/localhost:8080/fanart/" + currentArtId;
    console.log("artURL is: " + artURL);

    //Sending Request
    artResponse = getRequest(artURL, false);
    artResponse = JSON.parse(artResponse);
    console.log("artResponse: " + artResponse)

    //Taking action based on response
    if (artResponse != "error") {
        //Setting elements
        fanartTitle.innerHTML = artResponse.title;
        fanartAuthor.innerHTML = artResponse.author.username;
        fanartPostDate.innerHTML = artResponse.postDate;
        fanartTags.innerHTML = artResponse.tags;
        fanartImg.src = artResponse.url;

        //Retrieving Id limiters
        //Setting up isURL
        idURL = "http:/localhost:8080/fanart/info/";
        console.log("idURL is: " + idURL);
        idResponse = getRequest(idURL, false);
        if (idResponse != "error") {
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


        if (loggedIn) {
            //Retrieving rate on fanart by user
            //Setup request
            rateURL = "http:/localhost:8080/rateart?artId=" + currentArtId + "&userId=" + currentUserId;
            console.log("rateURL: " + rateURL);

            rateResponse = getRequest(rateURL, false);
            rateResponse = JSON.parse(rateResponse);

            if (rateResponse != "error") { //Request is successful. Update the relevant checkbox
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
            }
            //Retrieving report on fanart by user
            //Setup reportURL
            reportURL = "http:/localhost:8080/reportart?artId=" + currentArtId + "&userId=" + currentUserId;
            console.log("reportURL: " + reportURL);

            reportResponse = getRequest(reportURL, false);
            reportResponse = JSON.parse(reportResponse);

            //Request is successful. Update the relevant checkbox
            if (reportResponse != "error") {
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
            }
        }

        //Retrieving comments
        getComments();
    } else { //Request failed. Handle the error and format to default. Disable nextArt and prevArt buttons
        //Error handling
        const errorMessage = document.createElement("error");
        errorMessage.textContent = "Connection Error!";
        alert(
            "FAILED: Getting Fanart Failed!, Please Try Again or Contact Support."
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
}


/**
 *	Changes the image file between heart.png and heartEmpty.png and saves to the database based on the checked state
 */
function rateChkCheckChanged(chkId, imageId, type) {
    console.log("rateChkCheckChanged called");
    if (loggedIn) { //User can attempt to rate something because they are logged in
        image = document.getElementById(imageId);
        chk = document.getElementById(chkId);
        let imgURL, postURL, postResponse, postUser, postBody;

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
        postUser.id = currentUserId;
        postBody.author = postUser;
        postBody.isLiked = chk.checked
        postBody = JSON.stringify(postBody);
        console.log(postBody);

        //Send request
        postResponse = postRequest(postURL, postBody, false);

        //Request is successful. Change image to reflect
        if (postResponse != "error") {
            if (chk.checked) {
                imgURL = "images/heart.png";
            }
            else {
                imgURL = "images/heartEmpty.png";
            }
            console.log(imageId + " src changed to" + imgURL);
            image.src = imgURL;
        } else { //Request failed. Handle errors
            //Error handling
            const errorMessage = document.createElement("error");
            errorMessage.textContent = "Connection Error!";
            alert(
                "FAILED: Rating failed to post. Please Try Again or Contact Support."
            );
        }
    } else { //User is not logged in. Send alert to reflect that
        console.log("User was not logged in");
        alert(
            "You must be logged in to perform this action"
        );
    }
}

/**
 *	Changes the image file between flag.png and flagLow.png and saves to the database based on the checked state
 */
function flagChkCheckChanged(chkId, imageId, type) {
    console.log("flagChkCheckChanged called");
    if (loggedIn) { //User can attempt to rate something because they are logged in
        image = document.getElementById(imageId);
        chk = document.getElementById(chkId);
        let imgURL, postURL, postResponse, postUser, postBody;

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
        postUser.id = currentUserId;
        postBody.author = postUser;
        postBody.isReported = chk.checked
        postBody = JSON.stringify(postBody);
        console.log(postBody);

        //Send request
        postResponse = postRequest(postURL, postBody, false);

        //Request is successful. Change image to reflect
        if (postResponse != "error") {
            if (chk.checked) {
                imgURL = "images/flag.png";
            }
            else {
                imgURL = "images/flagLow.png";
            }
            console.log(imageId + " src changed to" + imgURL);
            image.src = imgURL;
        } else { //Request failed. Handle errors
            //Error handling
            const errorMessage = document.createElement("error");
            errorMessage.textContent = "Connection Error!";
            alert(
                "FAILED: Rating failed to post. Please Try Again or Contact Support."
            );
        }
    } else { //User is not logged in. Send alert to reflect that
        console.log("User was not logged in");
        alert(
            "You must be logged in to perform this action"
        );
    }
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
            prevResponse = getRequest(prevURL, false);

            //Request is successful, make changes based on response
            if (prevResponse != "error") {
                if (prevResponse == 'true') { //Fanart can be shown
                    currentArtId = parseInt(sessionStorage.getItem("FANART_ID"));
                    getFanart();
                    artAvailable = true;
                }
            }
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
            nextResponse = getRequest(nextURL, false);
            //Request is successful, make changes based on response
            if (nextResponse != "error") {
                if (nextResponse == 'true') { //Fanart can be shown. Set checkboxes to unchecked
                    rateChk.checked = false;
                    rateImg.src = "images/heartEmpty.png";
                    flagChk.checked = false;
                    flagImg.src = "images/flagLow.png";
                    currentArtId = parseInt(sessionStorage.getItem("FANART_ID"));
                    getFanart();
                    artAvailable = true;
                }
            }
        }
    }
}

/**Retrieves comments associated with the shown fanart
 */
function getComments() {
    console.log("getComments called")
    let getCommResponse, getCommURL,
        newComm, newCommText, newCommAuthor,
        newCommLike, newCommLikeLbl, newCommLikeImg,
        newCommReport, newCommReportLbl, newCommReportImg;

    //Setup getCommURL
    getCommURL = "http:/localhost:8080/artcomm/" + currentArtId;
    console.log("getCommURL: " + getCommURL);

    getCommResponse = getRequest(getCommURL, false);
    getCommResponse = JSON.parse(getCommResponse);
    //Request is successful. Add comment objects to the html
    if (getCommResponse != "error") {
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

            if (loggedIn) {
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
            }
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
    }
}

/** Saves a comment to the database based on the fanart's id and the user's id
 */
function postComment() {
    console.log("postComment called");
    if (loggedIn) { //User can attempt to rate something because they are logged in
        let postComm, postCommJSON, postURL, postUser;

        //Creating object for request body
        postComm = artComment;
        postUser = userIdDto;
        postUser.id = currentUserId;
        postComm.fanartId = currentArtId;
        postComm.content = newComment.value;
        postCommJSON = JSON.stringify(postComm);
        console.log(newComment.value);
        console.log(postCommJSON);

        //Setting up request
        postURL = "http:/localhost:8080/artcomm/create";
        postResponse = postRequest(postURL, postCommJSON, false);

        //Request is successful, update the comments
        if (postResponse == 200) {
            getComments();
        } else { //Request failed. Handle errors
            //Error handling
            const errorMessage = document.createElement("error");
            errorMessage.textContent = "Connection Error!";
            alert(
                "FAILED: Comment failed to post. Please Try Again or Contact Support."
            );
        }

        //Reseting text box
        newComment.value = "";

    } else { //User is not logged in. Send alert to reflect that
        console.log("User was not logged in");
        alert(
            "You must be logged in to perform this action"
        );
    }
}

/**Sends a get request to the backend
 * @param {any} url
 * @param {any} isAsync
 */
function getRequest(url, isAsync) {
    console.log("getRequest called with arguments: [url=" + url + "] [isAsync=" + isAsync + "]")
    let requestGet, responseGet;

    //Setup request
    requestGet = new XMLHttpRequest();
    requestGet.open("GET", url, isAsync);

    requestGet.onload = function () {
        console.log("GET: requestGet.onload called");

        //Request is successful. Send back the response object
        if (requestGet.status >= 200 && requestGet.status < 300) {
            console.log("GET: Request was successful!");
            console.log("GET: Response: " + requestGet.response);
            console.log("GET: Status Text: " + requestGet.statusText);
            responseGet = requestGet.response;
        } else { //Request failed. Handle errors
            responseGet = "error";
            console.log("GET: Request Failed")
            console.log(requestGet.statusText);
        }
    }

    requestGet.send();
    console.log("getRequest returned: " + responseGet);
    return responseGet;
}

/**Sends a post request to the backend
 * @param {any} url
 * @param {any} body
 * @param {any} isAsync
 */
function postRequest(url, body, isAsync) {
    console.log("postRequest called with arguments: [url=" + url + "] " +
        "[body=" + body + "] [isAsync=" + isAsync + "]")
    let requestPost, responsePost;

    //Setup request
    requestPost = new XMLHttpRequest();
    requestPost.open("POST", url, isAsync);
    requestPost.setRequestHeader("Content-Type", "application/json");
    requestPost.setRequestHeader("Auth", sessionStorage.getItem("JWT"));

    requestPost.onload = function () {
        console.log("POST: request.onload called");

        //Request is successful. Send back the response object
        if (requestPost.status >= 200 && requestPost.status < 300) {
            console.log("POST: Request was successful!");
            console.log("POST: Response: " + requestPost.response);
            console.log("POST: Status Text: " + requestPost.statusText);
            responsePost = 200;
        } else { //Request failed. Handle errors
            responsePost = "error";
            console.log("POST: Request Failed")
            console.log(requestPost.statusText);
        }
    }
    requestPost.send(body);
    return responsePost;
}
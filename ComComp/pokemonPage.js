console.log("Loaded pokemonPage.js");
let URL = "http://localhost:8080/pokemon-comment";
let USER = "http://localhost:8080/user/";

const commentContainer = document.getElementById('allComments');
document.getElementById('addComments').addEventListener('click', function (ev) {
    addComment(ev)});

document.getElementById('search').addEventListener('click', function (ev) {
    displayPokemon(ev)
});

async function addComment(_ev) {
    const textBox = document.createElement('div');
    const likeButton = document.createElement('button');
    likeButton.innerHTML = 'Like';
    likeButton.className = 'likeComment';
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'deleteComment';
    const reportButton = document.createElement('button');
    reportButton.innerHTML = 'Report';
    reportButton.className = 'reportComment';
    const wrapDiv = document.createElement('div');
    wrapDiv.className = 'wrapper';
    wrapDiv.style.marginLeft = 0;
    const commentBox = document.createElement('div');
    commentBox.className = 'commentBox';
    commentBox.style.marginLeft = 0;
    let commentText = document.getElementById('newComment').value;
    document.getElementById('newComment').value = '';
    textBox.innerHTML = commentText;
    let pokeId = parseInt(document.getElementById('pokemon_picture').getAttribute('title')).valueOf();
    let user_id =  parseInt(sessionStorage.getItem('USER_ID')).valueOf();
    let node = {user_id: user_id, pokemon_id: pokeId, comment_content:commentText, is_flagged: false, likes:0, reports:0};
    let resp = await storeComment(node);
    likeButton.addEventListener('click', _like_ev => likeComment(node, _like_ev) && likeButton.removeEventListener);
    deleteButton.addEventListener('click', _delete_ev => deleteComment(node, _delete_ev));
    reportButton.addEventListener('click', _report_ev => reportComment(node, _report_ev));
    wrapDiv.append(textBox)
    commentBox.append(wrapDiv, likeButton, deleteButton, reportButton);
    wrapDiv.id = 'comment';
    commentContainer.appendChild(commentBox);
}

async function getAll() {
    let pokeId = parseInt(document.getElementById('pokemon_picture').getAttribute('title')).valueOf();
    let URL_2 = `http://localhost:8080/pokemon-comment/all${pokeId}`;
    commentContainer.innerHTML = null;
    const response = await fetch(URL_2);
    const data = await response.text();
    console.log(data);
    const nodes = JSON.parse(data);
    console.log(nodes);
    for (let node of nodes) {
        let commentText = node.comment_content;
        const userResponse = await fetch(USER + node.user_id);
        const userData = await userResponse.text();
        let usertransfer = JSON.parse(userData);
        let username = usertransfer.username;
        const textBox = document.createElement('div');
        const likeButton = document.createElement('button');
        likeButton.innerHTML = 'Like';
        likeButton.className = 'likeComment';
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.className = 'deleteComment';
        const reportButton = document.createElement('button');
        reportButton.innerHTML = 'Report';
        reportButton.className = 'reportComment';
        reportButton.id = node.id;
        deleteButton.addEventListener('click', _delete_ev => deleteComment(node));
        likeButton.addEventListener('click', _like_ev => likeComment(node) && likeButton.removeEventListener);
        reportButton.addEventListener('click', _report_ev => reportComment(node, _report_ev));
        const wrapDiv = document.createElement('div');
        wrapDiv.className = 'wrapper';
        wrapDiv.style.marginLeft = 0;
        const commentBox = document.createElement('div');
        commentBox.className = 'commentBox';
        commentBox.style.marginLeft = 0;
        textBox.innerHTML = commentText;
        wrapDiv.append(textBox);
        commentBox.append(username, wrapDiv, likeButton, deleteButton, reportButton);
        commentContainer.appendChild(commentBox);
    }
}

async function storeComment(json) {
    const request = await fetch(URL, {
        method:'POST',
        headers: { 
            'Content-Type':'application/json',
        },
       
        body: JSON.stringify(json)
    }).then(getAll());
    const response = request.body;
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
        return (JSON.stringify(response));
    } else {
        console.log('BAD');
    }
}

async function likeComment(json, _like_ev) {
    json.likes += 1;
    const request = await fetch(URL, {
        method:'PUT',
        headers: { 
            'Content-Type':'application/json',
        },
    
        body: JSON.stringify(json)
    });
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
    } else {
        console.log('BAD');
    }
}

async function reportComment(json, _report_ev) {
    if (!json.is_flagged) {
        json.is_flagged = true;
    }
    json.reports += 1;
    const request = await fetch(URL, {
        method:'PUT',
        headers: { 
            'Content-Type':'application/json',
        },
    
        body: JSON.stringify(json)
    });
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
    } else {
        console.log('BAD');
    }
}

async function deleteComment(json, _delete_ev) {
    const request = await fetch(URL, {
        method:'Delete',
        headers: { 
            'Content-Type':'application/json',
        },
       
        body: JSON.stringify(json)
    });
    console.log(json);
    if (request.ok) {
        console.log('GOOD');
        getAll();
        
    } else {
        console.log('BAD');
    }
}

function getPokemonId() {
    return sessionStorage.getItem("POKEMON_ID");   
}

async function displayPokemon(ev) {
    const pokemonName = document.getElementById('query').value;
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    let pokeString = await response.text();
    let pokemonData = JSON.parse(pokeString);
    let sprite = document.createElement('img');
    let types = pokemonData.types;
    for (let i in types) {
        let t = document.createElement('div');
        t.innerHTML += types[i].type.name + " ";
        t.setAttribute('class', 'val');
        document.getElementById('type').innerHTML = null;
        document.getElementById('type').appendChild(t);
    }
    sprite.src = pokemonData.sprites.other["official-artwork"].front_default;
    sprite.setAttribute('class', 'pokeImg');
    sprite.setAttribute('id', 'pokemon_picture');
    sprite.setAttribute('title', pokemonData.id.toString());
    const spriteContainer = document.getElementById("pokemonSpriteContainer");
    spriteContainer.innerHTML = null;
    spriteContainer.appendChild(sprite);
    const stats = pokemonData.stats;
    for (let i in stats) {
        console.log(stats[i].base_stat.toString()+'px');
        document.getElementById(stats[i].stat.name).setAttribute('style', 'height: '+((stats[i].base_stat/150)*100).toString()+'px;');
        document.getElementById(stats[i].stat.name).innerHTML = stats[i].base_stat;
    }
    getAll();
}

/*Script Variables*/
let logImg = document.getElementById("logImg");
let loggedIn = false;
let currentUserId = getUserId();

/*Event Listeners*/
logImg.onclick = function () { logStateChange(); }

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
    if (loggedIn) { //User is logged in. Will log them out
        sessionStorage.removeItem("USER_ID");
        logImg.src = "images/log-in.png";
        loggedIn = false;
        currentUserId = null;
    } else { //User is not logged in. Will link them to login.html
        window.location.href = "login.html";
    }
}

getAll();
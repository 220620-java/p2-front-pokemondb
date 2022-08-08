console.log("Loaded pokemonPage.js");

// Change this to the destination domain name
let destinationDomain = window.location.hostname;
let destinationPort = ":8080";
// -----------------------------------------

let URL = "http://localhost:8080/pokemon-comment";
let USER = "http://localhost:8080/user/";

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || 
    window.location.hostname === "") {
    console.log("It's a local server!");
    destinationDomain = window.location.hostname;
}
else if (window.location.hostname == "pokepost-test.s3-website-us-east-1.amazonaws.com") {
    destinationDomain = "ec2-44-202-125-216.compute-1.amazonaws.com";
}

const commentContainer = document.getElementById('allComments');
document.getElementById('addComments').addEventListener('click', function (ev) {
    addComment(ev)});

console.log("Destination domain: " + destinationDomain);
document.getElementById('search').addEventListener('click', function (ev) {
    displayPokemon(destinationDomain, document.getElementById('query').value);
});

const urlParams = new URLSearchParams(window.location.search);
console.log("URLPARAMS: " + urlParams);
const paramPokemon = urlParams.get('pokemon');
console.log("Pokemon: " + pokemon);

return;
if (paramPokemon) {
    displayPokemon (destinationDomain, paramPokemon);
}

async function displayPokemon(domain, pokemonNameID) {
    // Build the URL
    let pokemonURL = "http://" + domain + destinationPort + "/pokemon/" + pokemonNameID;

    // Send the fetch request
    let response = await fetch(pokemonURL);

    // Receive the response
    let pokeString = await response.text();
    let pokemonJSON = JSON.parse(pokeString);

    console.log(pokemonJSON);
    const pokemonName = pokemonJSON.name;
    const pokemonID = pokemonJSON.id;
    const pokemonHeight = pokemonJSON.heightInFeetInches;
    const pokemonWeight = pokemonJSON.weightInPoundsString;
    const pokemonTypes = pokemonJSON.types;
    const pokemonBaseStats = pokemonJSON.baseStats;
    const pokemonImageURL = pokemonJSON.imageUrl;
    const pokemonGeneration = pokemonJSON.generation;
    const pokemonCategory = pokemonJSON.category;
    const pokemonDescription = pokemonJSON.description;
    const pokemonEvolution = pokemonJSON.evolutionChain;
    const pokemonLocation = pokemonJSON.locationVersions;
    const pokemonBaseExperience = pokemonJSON.baseExperience;
    const pokemonAbilities = pokemonJSON.abilities;
    const pokemonMoves = pokemonJSON.moves;


    /*
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
    */
    getAllPokemonComments();
}

async function addComment(_ev) {
    // Text Box
    const textBox = document.createElement('div');

    // Like Button
    const likeButton = document.createElement('button');
    likeButton.innerHTML = 'Like';
    likeButton.className = 'likeComment';

    // Delete Button
    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = 'Delete';
    deleteButton.className = 'deleteComment';

    // Report Button
    const reportButton = document.createElement('button');
    reportButton.innerHTML = 'Report';
    reportButton.className = 'reportComment';

    // Wrapper Div
    const wrapDiv = document.createElement('div');
    wrapDiv.className = 'wrapper';
    wrapDiv.style.marginLeft = 0;

    // Comment Box
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

async function getAllPokemonComments() {
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
    }).then(getAllPokemonComments());
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
        getAllPokemonComments();
        
    } else {
        console.log('BAD');
    }
}


console.log("Loaded pokemonPage.js");

// Change this to the destination domain name
let destinationDomain = window.location.hostname;
let destinationPort = ":8080";
// -----------------------------------------

let URL = "http://localhost:8080/pokemon-comment";
let USER = "http://localhost:8080/user/";
let commentContainer;

if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || 
    window.location.hostname === "") {
    console.log("It's a local server!");
    destinationDomain = window.location.hostname;
}
else if (window.location.hostname == "pokepost-test.s3-website-us-east-1.amazonaws.com") {
    destinationDomain = "ec2-44-202-125-216.compute-1.amazonaws.com";
}



console.log("Destination domain: " + destinationDomain);
document.getElementById('searchButton').addEventListener('click', function (ev) {
    displayPokemon(destinationDomain, document.getElementById('query').value);
});

const urlParams = new URLSearchParams(window.location.search);
console.log("URLPARAMS: " + urlParams);
const paramPokemon = urlParams.get('pokemon');
console.log("Pokemon: " + pokemon);
let currentPokemonId = paramPokemon;

if (currentPokemonId) {
    displayPokemon (destinationDomain, currentPokemonId);
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

    document.getElementById("pokemonContainer").setAttribute("style", "display: block");

    // Title
    const pokemonTitleH1 = document.getElementById("pokemon-title");
    pokemonTitleH1.innerText = "#" + pokemonID + " " + toTitleCase(pokemonName);
    currentPokemonId = pokemonID;

    // Image
    document.getElementById("pokemonSpriteContainer").setAttribute("style", "display: block");
    const pokemonPicture = document.getElementById("pokemon_picture");
    pokemonPicture.title = pokemonName;
    pokemonPicture.alt = pokemonName;
    pokemonPicture.setAttribute("src", pokemonImageURL);

    // HP Stat
    document.getElementById("pokemon-stats-title").setAttribute("style", "display: block");
    document.getElementById("pokemonStatsContainerId").setAttribute("style", "display: block");
    const hp = pokemonBaseStats.hp;
    const hpStat = document.getElementById("hp-stat");
    const hpNum = document.getElementById("hp-num");
    hpNum.innerText = "HP " + hp;
    hpStat.setAttribute("style", "height: " + (hp+20) + "px");

    // Attack Stat
    const attack = pokemonBaseStats.attack;
    const attackStat = document.getElementById("atk-stat");
    const attackNum = document.getElementById("atk-num");
    attackNum.innerText = "Attack " + attack;
    attackStat.setAttribute("style", "height: " + (attack+20) + "px");

    // Defense Stat
    const defense = pokemonBaseStats.defense;
    const defenseStat = document.getElementById("def-stat");
    defenseStat.setAttribute("style", "height:" + (defense+20) + "px");
    const defenseNum = document.getElementById("def-num");
    defenseNum.innerText = "Defense " + defense;

    // Special Attack Stat
    const specialAttack = pokemonBaseStats["special-attack"];
    const specialAttackStat = document.getElementById("spa-stat");
    specialAttackStat.setAttribute("style", "height:" + (specialAttack+20) + "px");
    const specialAttackNum = document.getElementById("spa-num");
    specialAttackNum.innerText = "Special Atk. " + specialAttack;

    // Special Defense Stat
    const specialDefense = pokemonBaseStats["special-defense"];
    const specialDefenseStat = document.getElementById("spf-stat");
    specialDefenseStat.setAttribute("style", "height:" + (specialDefense+20) + "px");
    const specialDefenseNum = document.getElementById("spf-num");
    specialDefenseNum.innerText = "Special Def. " + specialDefense;

    // Speed Stat
    const speed = pokemonBaseStats.speed;
    const speedStat = document.getElementById("spd-stat");
    speedStat.setAttribute("style", "height:" + (speed+20) + "px");
    const speedNum = document.getElementById("spd-num");
    speedNum.innerText = "Speed. " + speed;

    // Types
    const typeDiv = document.getElementById("type-target");
    typeDiv.innerHTML = "";
    const typeH1 = document.createElement('h1');
    typeH1.innerText = "Type";
    typeDiv.appendChild(typeH1);
    for (let type of pokemonTypes) {
        const typeH2 = document.createElement('h2');
        typeH2.setAttribute('class', 'type');
        typeH2.setAttribute('id', type);
        typeH2.innerText = toTitleCase(type);
        typeDiv.appendChild(typeH2);
    }

    // Generation
    const genHeader = document.getElementById("gen-target");
    genHeader.innerText = "Generation " + pokemonGeneration;

    // Category
    const categoryHeader = document.getElementById("cat-target");
    categoryHeader.innerText = "Category: " + pokemonCategory;

    // Height
    const heightHeader = document.getElementById("height-target");
    heightHeader.innerText = "Height: " + pokemonHeight;
    
    // Weight
    const weightHeader = document.getElementById("weight-target");
    weightHeader.innerText = "Weight: " + pokemonWeight;

    // Description
    const descriptionTarget = document.getElementById("description-target");
    descriptionTarget.innerText = pokemonDescription;

    // Evolution
    const evolutionTarget = document.getElementById("evolution-target");
    evolutionTarget.innerHTML = "";

    let count = 1;
    for (let evolution of pokemonEvolution) {
        let eName = evolution[0];

        // Send the fetch request
        let eURL = "http://" + domain + destinationPort + "/pokemon/poke/" + eName.toLowerCase();
        let eResponse = await fetch(eURL);

        // Receive the response
        let eString = await eResponse.text();
        let eJSON = JSON.parse(eString);
        let eId = eJSON.id;
        let eImage = eJSON.imageUrl;

        const eDiv = document.createElement("div");
        const eNameHeader = document.createElement("h1");
        eNameHeader.innerText = "(" + count + ") " + "#" + eId + " " + toTitleCase(eName);
        
        const eImg = document.createElement("img");
        eImg.setAttribute("src", eImage);

        eDiv.appendChild(eNameHeader);
        eDiv.appendChild(eImg);
        evolutionTarget.appendChild(eDiv);
        count++;
    }
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
    const commentContainerId = document.getElementById("commentContainerId");
    commentContainerId.setAttribute("style", "display: block");
    // let pokeId = parseInt(document.getElementById('pokemon_picture').getAttribute('title')).valueOf();
    
    // let URL_2 = `http://localhost:8080/pokemon-comment/all${pokeId}`;
    let URL_2 = "http://" + destinationDomain + destinationPort + `/pokemon-comment/all${currentPokemonId}`;
    if (commentContainer != null) {
        commentContainer.innerHTML = null;
    }
    commentContainerId.innerHTML = null;
    const response = await fetch(URL_2);
    const data = await response.text();
    console.log(data);
    const nodes = JSON.parse(data);
    console.log(nodes);
    
    // Create section header
    const sectionHeader = document.createElement ("h1");
    sectionHeader.innerText = "Comment Section";
    commentContainerId.appendChild(sectionHeader);

    for (let node of nodes) {
        let commentText = node.comment_content;
        const userResponse = await fetch(USER + node.user_id);
        const userData = await userResponse.text();
        let usertransfer = JSON.parse(userData);
        let username = usertransfer.username;
        


        const wrapDiv = document.createElement('div');
        wrapDiv.className = 'wrapper';
        wrapDiv.style.marginLeft = 0;
        const commentBox = document.createElement('div');
        commentBox.className = 'commentBox';
        commentBox.style.marginLeft = 0;
        const textBox = document.createElement('div');
        textBox.innerHTML = commentText;
        wrapDiv.append(textBox);
        commentBox.append(username, wrapDiv);
        if (isUserLoggedIn ()) {
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
            commentBox.append(likeButton, deleteButton, reportButton);
        }
        commentContainerId.appendChild(commentBox);
        createAddComment ();
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

function toTitleCase(str) {
    return str.replace(
      /\w*/g,
      function(txt) {
        
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
}

function createAddComment () {
    if (isUserLoggedIn ()) {
        const newComment = document.createElement("div");
        newComment.className = "newComment";

        const commentLabel = document.createElement ("label");
        commentLabel.id = "username"
        commentLabel.setAttribute ("for", "newComment");
        commentLabel.name = "newComment";

        const textArea = document.createElement ("textarea");
        textArea.id = "newComment";

        const commentButton = document.createElement ("button");
        commentButton.id = "addComments";
        commentButton.innerText = "Add Comment";
        commentButton.setAttribute ("style", "float: right");
        commentButton.setAttribute ("style", "margin-top: 10px");

        const allCommentsDiv = document.createElement ("div");
        allCommentsDiv.id = "allComments";

        newComment.appendChild (commentLabel);
        newComment.appendChild (textArea);
        newComment.appendChild (commentButton);
        newComment.appendChild (allCommentsDiv);

        document.getElementById("commentContainerId").appendChild(newComment);
        commentContainer = document.getElementById('allComments');
        document.getElementById('addComments').addEventListener('click', function (ev) {
            addComment(ev)});
    }
}

function isUserLoggedIn () {
    return (sessionStorage.getItem("USERNAME") && sessionStorage.getItem("JWT"));
}
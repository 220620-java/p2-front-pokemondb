
let generateBtn = document.querySelector("#search");
generateBtn.addEventListener("click", getPokemon, false);

function capitalizeFirstLetter(str) {
    if (str)
        return str.charAt(0).toUpperCase() + str.slice(1);
    else
        return '';
}

function lowerCaseName(str) {
    return str.toLowerCase();
}


let pokeId = 0;
let currentUserId = getUserId();
let loggedIn = false;
let logImg = document.getElementById("logImg");

logImg.onclick = function () { logStateChange(); }

function getPokemon(e) {
    const name = document.querySelector("#pokemonName").value;
    const pokemonName = lowerCaseName(name);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelector(".pokemonBox").innerHTML = `
            <div class="pokecard"> 
            <h4>ID: ${data.id}</h4>
            <h4><button id="pokemonKey" type="button" class="btn-add">ADD</button></h4>
            <img
            src="${data.sprites.other["official-artwork"].front_default}"
            alt="Pokemon name"
            />
            <h3>${capitalizeFirstLetter(data.name)}</h3>
            </div>
            <div class="pokemonInfos">
            <h4>Abilities: </h4>    
                    <p>${data.abilities[0].ability.name}</p>
                    <p>${data.abilities[1].ability.name}</p>
                
            <h4>Types: </h4>       
                    <p>${data.types[0].type.name}</p>    
            </div>
            <div class="pokemonInfos">
                <h4>Stats </h4>            
                <p>HP: ${data.stats[0].base_stat}</p>
                <p>Attack: ${data.stats[1].base_stat}</p>
                <p>Defense: ${data.stats[2].base_stat}</p>
                <p>Special Attack: ${data.stats[3].base_stat}</p>
                <p>Special Defense: ${data.stats[4].base_stat}</p>
                <p>Speed: ${data.stats[5].base_stat}</p>
            </div>`;
            pokeId = data.id;
            document.getElementById('pokemonKey').addEventListener('click', function () { postWishlist() })

        })
        .catch((error) => {
            document.querySelector(".pokemonBox").innerHTML = `
            <h4>Pokemon Got Away!! </h4>
            `;
            console.log("Pokemon Got Away!!", error);
        });

    e.preventDefault();


    const button = document.createElement('button')
    button.innerText = 'testing'
    button.addEventListener('click', () => {
        alert('Good Luck!')
    })
    document.body.appendChild(button)
}

let wishlist = {
    id: null,
    user: { id: 0 },
    pokemon: { id: 0 },
    created_at: Date.now()
}

function postWishlist() {
    let pokelist = wishlist;
    pokelist.pokemon.id = pokeId;
    pokelist.user.id = currentUserId;

    const url = "http://localhost:8080/wishlist"
    fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(pokelist) })
}

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
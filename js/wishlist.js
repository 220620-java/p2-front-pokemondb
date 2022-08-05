
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

function getPokemon(e) {
    const name = document.querySelector("#pokemonName").value;
    const pokemonName = lowerCaseName(name);

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
        .then((response) => response.json())
        .then((data) => {
            document.querySelector(".pokemonBox").innerHTML = `
    <div>
        <img
        src="${data.sprites.other["official-artwork"].front_default}"
        alt="Pokemon name"
        />
        <h3>${capitalizeFirstLetter(data.name)}</h3>
    </div>
    <div class="pokemonInfos">
        <h4>Abilities: </h4>
            <ul>
                <li>${data.abilities[0].ability.name}</li>
                <li>${data.abilities[1].ability.name}</li>
            </ul>
        <h4>Location: ${data.location}</h4>
        
    </div>
    <div class="pokemonInfos">
        <h4>Stats </h4>
        <ul>
            <li>HP: ${data.stats[0].base_stat}</li>
            <li>Attack: ${data.stats[1].base_stat}</li>
            <li>Defense: ${data.stats[2].base_stat}</li>
            <li>Special Attack: ${data.stats[3].base_stat}</li>
            <li>Special Defense: ${data.stats[4].base_stat}</li>
            <li>Speed: ${data.stats[5].base_stat}</li>
        </ul>
    </div>`;
        })
        .catch((error) => {
            document.querySelector(".pokemonBox").innerHTML = `
    <h4>Pokemon Got Away!! </h4>
    `;
            console.log("Pokemon Got Away!!", error);
        });

    e.preventDefault();
}


function createWishlist () {
    
}
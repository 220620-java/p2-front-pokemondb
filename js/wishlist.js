
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
            <div class="pokecard"> 
            <h4>ID: ${data.id}</h4>
            <h4><button type="button" class="btn-add">ADD</button></h4>
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

const api_url = "https://pokeapi.co/api/v2/pokemon/";


const update_list = (id, name) => {
    let pokemon = list.find(pokemon => pokemon.id === id)
    if(pokemon) {
        pokemon = id
    } else {
        list.push({
            id, name
        })
    }
}


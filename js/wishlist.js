// let apiURL = 'https://pokeapi.co/api/v2/pokemon/';
// let url = "http://pokepost-env.eba-jzp4ndpr.us-east-1.elasticbeanstalk.com/pokemon/" + pokemon_name;

document.getElementById('getData').onclick = getData;

function getData() {
    let userInput = document.getElementById('dataInput').value;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = receiveData;
    xhttp.open('GET', url + '' + userInput);
    xhttp.send();

    function receiveData() {
        if (xhttp.readyState === 4) {
            let dataSection = document.getElementById('data');
            dataSection.innerHTML = '';

            if (xhttp.status === 200) {
                let response = xhttp.responseText;
                console.log(response);
                response = JSON.parse(response);
                console.log(response);
                populateData(response);
            } else {
                dataSection.innerHTML = 'It Got Away!';
            }
        }
    }
}

function populateData(response) {
    let dataSection = document.getElementById('data');

    let nameTag = document.createElement('h3');
    nameTag.innerHTML = capitalize(response.name);
    let abilitiesArray = response.abilities;
    let abilities = document.createElement('ul')
    for (let ability of abilitiesArray) {
        let abilityLi = document.createElement('li');
        abilityLi.innerHTML = capitalize(ability.ability.name);
        abilities.appendChild(abilityLi);
    }

    dataSection.appendChild(nameTag);
    dataSection.innerHTML += 'Abilities<br>';
    dataSection.appendChild(abilities);

    let spirtesObject = response.sprites;
    for (let sprite in spirtesObject) {
        if (spirtesObject[sprite]) {
            let spriteImg = document.createElement('img');
            spriteImg.src = spirtesObject[sprite];
            dataSection.appendChild(spriteImg);
        }
    }
}

function capitalize(str) {
    if (str)
        return str.charAt(0).toUpperCase() + str.slice(1);
    else
        return '';
}

// for (let i = 0; i < 10; i++) {
// const img = document.createElement("img");
// img.src = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png";
// document.body.appendChild(img);
// }

function displayResult() {
    var firstRow=document.getElementById('listPokemon').rows[0];
    var x=firstRow.insertCell(-1);
    x.innerHTML="Pokemon Name";

    var img = document.createElement('img');
    img.src = "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/006.png";
    x.appendChild(img);
}


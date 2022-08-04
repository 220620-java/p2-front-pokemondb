let apiURL = 'https://pokeapi.co/api/v2/pokemon/';
//let apiURL = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";

document.getElementById('getData').onclick = getData;

function getData() {
    let userInput = document.getElementById('dataInput').value;
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = receiveData;
    xhttp.open('GET', apiURL + '' + userInput);
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




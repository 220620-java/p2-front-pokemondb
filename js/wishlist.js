let apiURL = 'https://pokeapi.co/api/v2/pokemon/';

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

        let imageUrl = response.sprites;
        for (let sprite in imageUrl) {
            if (imageUrl[sprite]) {
                let spriteImg = document.createElement('img');
                spriteImg.src = imageUrl[sprite];
                dataSection.appendChild(spriteImg);
            }
        }
    }
}
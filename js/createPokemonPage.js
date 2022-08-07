console.log("Loaded createPokemonPage.js");

function createPokemonPage (pokemonJSON) {

    pokemonJSON = JSON.parse(pokemonJSON);

    if (pokemonJSON == null) {
        console.log ("Json is null!");
        return;
    }

    console.log (pokemonJSON);

    const pokemonName = pokemonJSON.name;
    const pokemonID = pokemonJSON.id;
    const pokemonCategory = pokemonJSON.category;
    const pokemonImageURL = pokemonJSON.imageUrl;
    const pokemonGeneration = pokemonJSON.generation;
    const pokemonDescription = pokemonJSON.description;
    const pokemonHeight = pokemonJSON.heightInFeetInches;
    const pokemonWeight = pokemonJSON.weightInPoundsString;
    const pokemonBaseStats = pokemonJSON.baseStats;
    const pokemonEvolution = pokemonJSON.evolutionChain;
    const pokemonLocation = pokemonJSON.locationVersions;

    // Grab target div
    const outputDiv = document.getElementById ("pokemon_output");
    outputDiv.innerHTML = "";

    // NAME ID
    const titleDiv = document.createElement ("div");
    const titleLine = document.createElement("h1");
    const titleText = document.createTextNode(pokemonName + " (" + pokemonID + ")");
    titleDiv.appendChild (titleLine);
    titleLine.appendChild (titleText);
    outputDiv.appendChild (titleDiv);

    // IMAGE
    const pictureDiv = document.createElement ("div");
    const pokemonImg = document.createElement("img");
    pokemonImg.src = pokemonImageURL;
    pictureDiv.appendChild (pokemonImg);
    outputDiv.appendChild (pictureDiv);

    // Category
    const categoryDiv = document.createElement ("div");
    const categoryLine = document.createElement("h2");
    const categoryText = document.createTextNode(pokemonCategory);
    categoryDiv.appendChild (categoryLine);
    categoryLine.appendChild (categoryText);
    outputDiv.appendChild (categoryDiv);

    // Generation, Height, Weight, Description Section
    const infoDiv = document.createElement ("div");

    // Generation
    const genLine = document.createElement("p");
    const genText = document.createTextNode("Generation: " + pokemonGeneration);
    genLine.appendChild (genText);
    infoDiv.appendChild (genLine);

    // Measurements
    const measurementLine = document.createElement("p");
    const heightText = document.createTextNode("Height: " + pokemonHeight + " Weight: " + pokemonWeight);
    measurementLine.appendChild (heightText);
    infoDiv.appendChild (measurementLine);

    // Description
    const descriptionLine = document.createElement("p");
    const descriptionText = document.createTextNode("Description: " + pokemonDescription);
    descriptionLine.appendChild (descriptionText);
    infoDiv.appendChild (descriptionLine);
    outputDiv.appendChild (infoDiv);

    // Base Stats
    const baseStatsDiv = document.createElement ("div");
	baseStatsDiv.id = "stat-circles";

    let keys = Object.keys(pokemonBaseStats);

    let table = document.createElement('table'); // creates a table element
    let rows = 2;
    let cols = 6;
    for (let i = 0; i < rows; i++) {
        let tr;
        tr = document.createElement('tr'); // creates a table row element
        for (let j = 0; j < cols; j++) {
            let td;
            // if it's the first row, create a table header
            // otherwise, create a table data element
            if (i === 0) {
                td = document.createElement('th');
                td.innerText = keys[j];
                tr.appendChild(td);
            }
            else {
                td = document.createElement('td');
                td.innerText = pokemonBaseStats[keys[j]];
                tr.appendChild(td);
            }
            
        }
        
        table.appendChild(tr);
    }
    outputDiv.appendChild (baseStatsDiv);

    // Evolution Chain
    const evolutionDiv = document.createElement ("div");

    const evolutionLine = document.createElement("p");
    const evolutionText = document.createTextNode("Evolution Chain: ");
    evolutionLine.appendChild (evolutionText);
    evolutionDiv.appendChild (evolutionLine);

    for (const evolution of pokemonEvolution) {
        const name = evolution[0];
        const link = document.createElement("a");
        const linkText = document.createTextNode(name);
        link.appendChild(linkText);
        link.href="/pokemon/" + name;
        const p = document.createElement("p");
        p.appendChild(link);
        evolutionDiv.appendChild (p);
    }
    outputDiv.appendChild (evolutionDiv);

    // Locations/Versions Section
    const locationDiv = document.createElement ("div");

    const locationP = document.createElement("p");
    const locationText = document.createTextNode("Locations: ");
    locationP.appendChild (locationText);
    locationDiv.appendChild (locationP);

    for (let i = 0; i < pokemonLocation.length; i++) {
        // locations
        const locationName = pokemonLocation[i].locationName;
        const link = document.createElement("a");
        const linkText = document.createTextNode(locationName);
        link.appendChild(linkText);
        const locationURL = pokemonLocation[i].locationURL;
        const urlSplit = locationURL.split('/');
        const urlSplitLength = urlSplit.length;
        link.href=("/" + urlSplit[urlSplitLength - 3] + "/" + urlSplit[urlSplitLength - 2]);
        const p = document.createElement("p");
        p.appendChild(link);
        const methods = pokemonLocation[i].methods;
        const maxChance = pokemonLocation[i].maxChance;
        const versionName = pokemonLocation[i].versionName;
        const text = document.createTextNode(" :  " + versionName + ": " + methods + " " + maxChance);
        p.appendChild(text);
        locationDiv.appendChild (p);
    }
    outputDiv.appendChild (locationDiv);
}
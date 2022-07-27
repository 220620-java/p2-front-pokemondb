console.log("Loaded createPokemonPage.js");

export function createPokemonPage (pokemonJSON) {

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
    const pokemonEvolution = pokemonJSON.evolutionChain;

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

    // Evolution Chain
    const evolutionDiv = document.createElement ("div");

    const evolutionLine = document.createElement("p");
    const evolutionText = document.createTextNode("Evolutions: ");
    evolutionLine.appendChild (evolutionText);
    evolutionDiv.appendChild (evolutionLine);

    for (const evolution of pokemonEvolution) {
        const name = evolution[0];
        const link = document.createElement("a");
        const linkText = document.createTextNode(name);
        link.appendChild(linkText);
        link.href="/pokemon/" + name;
        evolutionDiv.appendChild (link);
    }
    outputDiv.appendChild (evolutionDiv);
}

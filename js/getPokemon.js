import { getRequest } from "./getRequest.js";

// This javascript file will make a GET request for a pokemon.
// Once the connection is made and the request is sent out, a response would come back with all the pokemon information.
// The JS file would then output the info from the response to the html file.
export function getPokemon(pokemon_name, element_id) {
	console.log("Loaded getPokemon.js");

  	console.log("Running getPokemon.js with the name: " + pokemon_name);
  	let url = "http://localhost:8080/pokemon/" + pokemon_name;

	let pokemonResponse = getRequest (url);
	console.log (pokemonResponse);
	if (pokemonResponse != null) {
		sessionStorage.setItem("pokemon_object", pokemon_response);
		element_id.innerHTML = "<pre>" + pokemon_response + "</pre>";
	}
	return pokemonResponse;
}
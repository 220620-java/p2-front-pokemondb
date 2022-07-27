console.log("Loaded getPokemon.js");

// This javascript file will make a GET request for a pokemon.
// Once the connection is made and the request is sent out, a response would come back with all the pokemon information.
// The JS file would then output the info from the response to the html file.
function getPokemon(pokemon_name, element_id) {
  	// Opening a connection to the server
  	console.log("Running get_pokemon.js with the name: " + pokemon_name);
  	let url = "http://pokepost-env.eba-jzp4ndpr.us-east-1.elasticbeanstalk.com/pokemon/" + pokemon_name;
  	//constructing a json object to store the information
  	//in the request to be sent out.

  	console.log("URL is: " + url);

  	//Making a bridge to the server through XMLHttpRequest()
  	let request = new XMLHttpRequest();

  	//Initializaing a request to the order
  	request.open("GET", url, false);

  	//Setting the header of the API request
  	// request.setRequestHeader("Content-type", "application/json");

  	// Asynchronously set up request
  	request.onload = function () {
		console.log("request.onload is called!");

		// if the request is good and valid, store the response in session storage
		if (request.status >= 200 && request.status < 300) {
			console.log("Request is sent!");
			console.log("Response: " + request.response);
			console.log("Status Text: " + request.statusText);
			let pokemon_response = request.response;
			sessionStorage.setItem("pokemon_object", pokemon_response);
			// element_id.innerHTML = pokemon_response.replace(/(?:\r\n|\r|\n)/g, '<br>');
			element_id.innerHTML = "<pre>" + pokemon_response + "</pre>";
			return pokemon_response;
		} else {
			//Error handling
			const errorMessage = document.createElement("error");
			errorMessage.textContent = "Connection Error!";
			console.log(request.status);
			alert(
				"FAILED: Getting Pokemon Failed!, Please Try Again or Contact Support."
			);
		}
	};
	// Send out request
	request.send(null);
}

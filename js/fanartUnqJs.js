let rateChk = document.getElementById('rateChk');
let rateImg = document.getElementById('rateImg');
let flagChk = document.getElementById('flagChk');
let flagImg = document.getElementById('flagImg');

rateChk.onchange = rateChkCheckChanged;
function rateChkCheckChanged(){
	if (rateChk.checked){
		rateImg.src = "images/heart.png";
	}
	else{		
		rateImg.src = "images/heartEmpty.png";
	}
}

flagChk.onchange = flagChkCheckChanged;
function flagChkCheckChanged(){
	if (flagChk.checked){
		flagImg.src = "images/flag.png";
	}
	else{		
		flagImg.src = "images/flagLow.png";
	}
}
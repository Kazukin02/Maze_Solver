

// runs stop when the page is loaded
function setup() {
	createCanvas(400, 400);
}

// is repeatedly called roughly 60times per second
function draw() {
	background(120,120,120);
	for (let y=0; y<5; y++){
		for (let x=0; x<5; x++){
			square(30*x,30*y,30)	
		}
	}


	
}
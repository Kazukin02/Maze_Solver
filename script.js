class Maze {

	constructor(x,y,w,h,bgcolor,cs){
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		this.bgcolor = bgcolor
		this.cellsize = cs
		this.data = []
	}

	createEmptyMaze(){
		/**
		 * this method will create a 2d list or array that is this.width by this.height
		 * eg. if width =  3 and height = 2
		 * this.data = [[0,0,0],
		 * 							[0,0,0]]
		 */
	}

	render(){
		/**
		 * draw the maze on the canvas using the attributes
		 * 
		 */
		for (let y=0; y<5; y++){
			for (let x=0; x<5; x++){
				square(30*x,30*y,30)	
			}
		}
		
	}
	
}

var MAZE = new Maze(0,0,300,300,"white",30)

MAZE.createEmptyMaze()

console.log( JSON.stringify( MAZE.data ) )

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
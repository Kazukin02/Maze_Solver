
function myRandom(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}



class Maze {

	constructor(x,y,w,h,bgcolor,cs){
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		this.bgcolor = bgcolor
		this.cellsize = cs
		this.data = [] // 2d array that tracks what is in each tile
	}

	createEmptyMaze(){
		/**
		 * this method will create a 2d list or array that is this.width by this.height
		 * eg. if width =  3 and height = 2
		 * this.data = [[0,0,0],
		 * 							[0,0,0]]
		 */
		let vert_cells_num = Math.floor(this.height/this.cellsize)
		let hor_cells_num = Math.floor(this.width/this.cellsize)
		for (let i=0; i<vert_cells_num; i++){
			this.data.push([])
			for (let n=0; n<hor_cells_num; n++){
				this.data[i].push(0)
			}
		}
		console.log(JSON.stringify(this.data))
	}

	render(){
		/**
		 * draw the maze on the canvas using the attributes
		 *  0 = blank , walkable tile
		 *  1 = wall,
		 *  2 = water
		 *  3 = snow
		 *  4 = forest
		 *  5 = sand
		 */

		
		let vert_cells_num = Math.floor(this.height/this.cellsize)
		let hor_cells_num = Math.floor(this.width/this.cellsize)
		for (let y=0; y<vert_cells_num; y++){
			for (let x=0; x<hor_cells_num; x++){
				// draw the sqaure with different color base on the tile data.
				//once done push to your maze branch again
				/**
				 * git checkout <branchname> ( move to "branchname" branch)
				 * git status ( to check the current staging area, and branch)
				 *
				 * 1. git add . (add all change to staging area)
				 * 2. git commit -m "message"  ( confirm changes in staging area)
				 * 3. git push ( )
				 */
				if (this.data[y][x] == 0){
					let c = color(247,250,255) //path
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // wall
				else if (this.data[y][x] == 1){
					let c = color(78,79,79)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} //water
				else if (this.data[y][x] == 2){
					let c = color(150,191,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)}  // snow
				else if (this.data[y][x] == 3){
					let c = color(202,214,235)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // forest
				else if (this.data[y][x] == 4){ 
					let c = color(83,156,61)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // sand
				else if (this.data[y][x] == 5){ 
					let c = color(237,222,154)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)}
				}
				
			}
		}
		
}

function mouseDragged(){

	
	if (mouseX < MAZE.x || mouseX > MAZE.X + MAZE.width || mouseY < MAZE.y || mouseY > MAZE.y  + MAZE.height  ){
		return
	}
	/**
	 * 1. transform our mouseX & mouseY coordinate to row & col number ( base on cell size, and maze x y location)
	 * 2. change that particular tile to a 1
	 * 
	 */
	var row_mouse_pos = Math.floor(mouseY/MAZE.cellsize)
	var col_mouse_pos = Math.floor(mouseX/MAZE.cellsize)

	document.getElementById("mousey").innerHTML = row_mouse_pos
	document.getElementById("mousex").innerHTML = col_mouse_pos

	MAZE.data[row_mouse_pos][col_mouse_pos] = COLOR

	
}

var canvasX = 0
var canvasY = 0
var canvasW = 800
var canvasH = 800
var CELLSIZE = 20
var COLOR = 1

var MAZE = new Maze(canvasX,canvasY,canvasW,canvasH,"white", CELLSIZE)

btn_path = document.getElementById("path")
btn_path.addEventListener("click", () =>{
		COLOR = 0
	})

btn_wall = document.getElementById("wall")
btn_wall.addEventListener("click", () =>{
	COLOR = 1
})

btn_water = document.getElementById("water")
btn_water.addEventListener("click", () =>{
	COLOR = 2
})

btn_snow = document.getElementById("snow")
btn_snow.addEventListener("click", () =>{
	COLOR = 3
})

btn_forest = document.getElementById("forest")
btn_forest.addEventListener("click", () =>{
	COLOR = 4
})

btn_sand = document.getElementById("sand")
btn_sand.addEventListener("click", () =>{
	COLOR = 5
})



MAZE.createEmptyMaze()

//console.log( JSON.stringify( MAZE.data ) )

// runs stop when the page is loaded
function setup() {
	createCanvas(canvasW, canvasH, document.getElementById("myCanvas"));
}


// is repeatedly called roughly 60times per second
function draw() {
	
	background(120,120,120);
	
	MAZE.render()
	
}


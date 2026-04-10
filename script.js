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
				this.data[i].push(random(0,5))
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
				if (this.data[x][y] == 0){
					let c = color(247,250,255)
					fill(c);
					noStroke();
					square(this.cellsize*x,this.cellsize*y,this.cellsize)	
				if (this.data[x][y] == 1){
					let c = color(78,79,79)
					fill(c);
					noStroke();
					square(this.cellsize*x,this.cellsize*y,this.cellsize)	
				if (this.data[x][y] == 2){
					let c = color(150,191,255)
					fill(c);
					noStroke();
					square(this.cellsize*x,this.cellsize*y,this.cellsize)	
				if (this.data[x][y] == 3){
					let c = color(202,214,235)
					fill(c);
					noStroke();
					square(this.cellsize*x,this.cellsize*y,this.cellsize)	
				if (this.data[x][y] == 4){
					let c = color(83,156,61)
					fill(c);
					noStroke();
					square(this.cellsize*x,this.cellsize*y,this.cellsize)	
				if (this.data[x][y] == 5){
					let c = color(237,222,154)
					fill(c);
					noStroke();
					square(this.cellsize*x,this.cellsize*y,this.cellsize)	
				}
				
			}
		}
		
	}
	
}

var MAZE = new Maze(0,0,400,400,"white",20)

MAZE.createEmptyMaze()

//console.log( JSON.stringify( MAZE.data ) )

// runs stop when the page is loaded
function setup() {
	createCanvas(400, 400);
}

// is repeatedly called roughly 60times per second
function draw() {
	
	background(120,120,120);
	
	MAZE.render()
	
}
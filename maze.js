class Maze {

	constructor(x,y,w,h,bgcolor,cs){
		this.x = x
		this.y = y
		this.width = w
		this.height = h
		this.bgcolor = bgcolor
		this.cellsize = cs
		this.vert_cells_num = Math.floor(this.height/this.cellsize)
		this.hor_cells_num =  Math.floor(this.width/this.cellsize)
		this.data = [] // 2d array that tracks what is in each tile
	}

	createEmptyMaze(){
		/**
		 * this method will create a 2d list or array that is this.width by this.height
		 * eg. if width =  3 and height = 2
		 * this.data = [[0,0,0],
		 * 							[0,0,0]]
		 */

		for (let i=0; i < this.vert_cells_num; i++){
			this.data.push([])
			for (let n=0; n<this.hor_cells_num; n++){
				this.data[i].push(1)
			}
		}
	}

	render_map(){
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
					let c = color(247,250,255) 
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} //path
				else if (this.data[y][x] == 1){
					let c = color(78,79,79,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // wall
				else if (this.data[y][x] == 2){
					let c = color(150,191,255,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)}  //water
				else if (this.data[y][x] == 3){
					let c = color(202,214,235,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // snow
				else if (this.data[y][x] == 4){ 
					let c = color(83,156,61,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // forest
				else if (this.data[y][x] == 5){ 
					let c = color(237,222,154,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // sand
				else if (this.data[y][x] == 6){ 
					let c = color(255,102,178,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // start
				else if (this.data[y][x] == 7){ 
					let c = color(255,0,0,255)
					fill(c);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)}//end
				else if (this.data[y][x] == 10 || this.data[y][x] == 11){} // traversed
			}	
		}
	}

	render_color(){
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
				if (this.data[y][x] == 6){ 
					fill(255,102,178,255);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)} // start
				else if (this.data[y][x] == 7){ 
					fill(255,0,0,255);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)}//end
				else if (this.data[y][x] == 10){ // traversed
					//let c = color(255,30,200,127)
					fill(255,30,200,127);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)}
				else if (this.data[y][x] == 11){ // final path
					//let c = color()
					fill(255,165,0,127);
					square(this.cellsize*x,this.cellsize*y,this.cellsize)
				}
			}			
		}

	}// render_color()

} // Maze Class

if (typeof globalThis !== 'undefined') {
	globalThis.Maze = Maze;
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Maze;
}
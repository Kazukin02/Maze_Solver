var prevRow
var prevCol
var start_tile  
var end_tile 




class AnimationController{

	constructor(){
		this.progress = 0 //frames or %
		this.state = "pause"
		this.slider = document.getElementById("animation_slider") // html slider element
		this.animationInterval = null
		this.frames = SLIDER_FRAMES //references the global frames list
		this.playButton = document.getElementById("animate_btn")

		this.playButton.addEventListener("click", () =>{
			this.play_ani()
		})

		this.slider.addEventListener("input", () =>{
			clearInterval(this.animationInterval)
			this.progress = parseInt( this.slider.value)
			let slider_frame = this.frames[this.progress] 
			MAZE_color.data = slider_frame
			this.state = "pause"
			console.log("progress:", this.progress, "slider progress =", this.slider.value)
		})

		
	}


	play_ani(){
		if (this.frames.length <= 0   ){
			alert("solve the maze first!")
			this.state = "pause"
			return
		}

		if ( this.progress == this.frames.length ){
			this.state = "pause"
			alert("animation is done playing, rewind if you want to watch it again")
			return
		}

		
		// one_slider_tick = SLIDER_FRAMES.length / (animation_slider.max - animation_slider.min)

		if (this.state == "pause"){
			this.state = "play"
			this.slider.min = 0
			this.slider.max = this.frames.length-1
			this.slider.value = this.progress

			this.animationInterval = setInterval( ()=>{
				console.log("progress:", this.progress, "slider progress =", this.slider.value)

				// when theres no frames left
				if (this.progress == this.frames.length){
					clearInterval(this.animationInterval)
					this.state = "pause"
					return
				}

				let current_frame = this.frames[this.progress] 
				MAZE_color.data = current_frame
				this.slider.value = this.progress
				this.progress += 1

				//console.log("Animation_slider value:", this.slider.value)

			}, 500) // search animtion is 1 second perframe

		console.log("interval:", this.animationInterval)

		}
		else{
			this.state = "pause"
			clearInterval(this.animationInterval)
		}	
	}	

	rewind(){
		//does not pause animation, just skips a frame
	}

	forward(){
		//does not pause animation, just skips a frame

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
	// if color is start or end, make sure theres only 1 tile being marked
	if (COLOR == 6 || COLOR == 7){
		if ( prevCol != null && prevRow != null){
			if (COLOR == 6 && prevCOLOR == 7){
			}
			if (COLOR == 7 && prevCOLOR == 6){
			}
			else{
				MAZE.data[prevRow][prevCol] = 0
			}
		if (COLOR == 6){
			start_tile = coord_ID(row_mouse_pos, col_mouse_pos, MAZE)
		}
		if (COLOR == 7){
			end_tile = coord_ID(row_mouse_pos, col_mouse_pos, MAZE)
			console.log("-",end_tile)
		}
		}	
		MAZE.data[row_mouse_pos][col_mouse_pos] = COLOR
	}else{
		MAZE.data[row_mouse_pos][col_mouse_pos] = COLOR
	}

	prevRow = row_mouse_pos
	prevCol = col_mouse_pos
	prevCOLOR = COLOR

}


var canvasX = 0
var canvasY = 0
var canvasW = 800
var canvasH = 600
var CELLSIZE = 20
var COLOR = 1


var GLOBAL_FRAMES = [];
var ANI_INTERVAL = null;
var GLOBAL_PATH = []; //tracks the final path
var PATH_ANI_INTERVAL = null;
var SLIDER_FRAMES = [] // a list to track all states of the maze
var SLIDER_POS = 0
var animation_state = "pause"
var animation_slider = document.getElementById("animation_slider")

//testing

var animationController = new AnimationController()
var MAZE = new Maze(canvasX,canvasY,canvasW,canvasH,"white", CELLSIZE)
MAZE.createEmptyMaze()
var MAZE_color = new Maze(canvasX,canvasY,canvasW,canvasH,"white", CELLSIZE)
MAZE_color.createEmptyMaze()

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


btn_start = document.getElementById("start")
btn_start.addEventListener("click", () =>{
	COLOR = 6
})

btn_end = document.getElementById("end")
btn_end.addEventListener("click", () =>{
	COLOR = 7
})

slider = document.getElementById("animation_slider")


btn_img = document.getElementById("img_btn")
btn_img.addEventListener("click", () =>{

	// generate a dive with an img, abd some text 
	// image will expand upon hover
	let container = document.createElement("div")
	let container_text = document.createElement("div")
	let load_img_btn = document.createElement("button")
	let img_save = document.createElement("img")
	let right_div = document.getElementById("right")
	container.className = "mazecard"
	img_save.className ="mazeimg"
	container.appendChild(img_save)
	container.appendChild(container_text)
	container.appendChild(load_img_btn)

	//saving img 
	let canvasElement = myCanvas.elt
	let dataURL = canvasElement.toDataURL('image/png');
	img_save.src = dataURL;

	//defining container_text 
	let container_dict = {}
	container_dict["Algo"] = "algorithm"
	container_dict["tile_searched"] = "tile searched"
	

	//Creating/updating mazeArray html element data attributes to container
	img_save.dataset.mazeArray = JSON.stringify(MAZE.data)
	img_MAZE_data = img_save.dataset.mazeArray
	
	right_div.appendChild(container)

	//defining load_img button
	load_img_btn.innerHTML = "Load IMG"
	load_img_btn.addEventListener("click", () =>{
		let img_saved_array = JSON.parse(img_save.dataset.mazeArray)
		MAZE.data = img_saved_array
	})

	
})



	
btn_clear = document.getElementById("clear")
btn_clear.addEventListener("click",() => {
	GLOBAL_FRAMES = []
	ANI_INTERVAL = null
	GLOBAL_PATH = []; //tracks the final path
	PATH_ANI_INTERVAL = null;
	for (i=0; i < MAZE.data.length; i++){
		for (a=0; a < MAZE.data[i].length; a++){
			MAZE.data[i][a] = 1
			MAZE_color.data[i][a] = 1
		}
	}
	
})













var myCanvas;


// runs stop when the page is loaded
function setup() {
	 myCanvas = createCanvas(canvasW, canvasH, document.getElementById("myCanvas"));

	//console.log(convertToGraph(MAZE))
}


// is repeatedly called roughly 60times per second
function draw() {

	background(120,120,120);

	MAZE.render_map()
	MAZE_color.render_color()

}



solve_btn = document.getElementById("solve_btn")
solve_btn.addEventListener("click",()=>{
	
	let adjacency_graph = convertToGraph(MAZE)
	console.log("GRAPH:",adjacency_graph)

	//identify of start & end tile id

	let algochoice = document.getElementById("algos").value
	console.log("selected:", algochoice)
	console.log("start:",start_tile, "end:",end_tile)

	algos_dict = {
		"BFS": BFS_path,
		"DFS": DFS_path,
		"A-STAR": A_star_algorithm,
		"Dijstras": dijkstra_shortestpath,

	}
	//A_star_algorithm(adjacency_list, start_list, target_id) 
	// BFS_path(adjacency_list, start, target)
	//dijkstra_shortestpath(adjacency_list, start_list, target_id)
	
	let [visited, myframes] = algos_dict[algochoice](adjacency_graph, [0,start_tile], end_tile )
	console.log("frames:", JSON.stringify(myframes))
	console.log("visited:", visited)
	GLOBAL_FRAMES = myframes
	GLOBAL_PATH = shortest_path(visited, end_tile)

	/*** 
	 * FIND THE SHORTEST PATH
	 * by looking at the visited dictionary.
	 * start with the endtile , then visit parent tile, until you hit null
	 */



	let path = shortest_path(visited, end_tile)
	console.log("The solved path!!:", path)

	// write code to populate the SLIDER_FRAMES variable with changes from myframes

	for (let frame of myframes){
		if (frame["searched"] != []){
			for (let id of frame["searched"]){
				let [r,c] = ID_coord(id, MAZE)
				MAZE_color.data[r][c] = 10 
				SLIDER_FRAMES.push( structuredClone (MAZE_color.data) )
			}
		
		}
	}
	
	for (let path_frame of path){
		let [r,c] = ID_coord(path_frame, MAZE)
		console.log("path_frame:",path_frame)
		MAZE_color.data[r][c] = 11
		SLIDER_FRAMES.push( structuredClone (MAZE_color.data) )
	}
	
})


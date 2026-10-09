function myRandom(min, max){
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function coord_ID(row,col, maze){
	/**
	 *	takes in row & col number, and returns a single number id
	 *
	 * 
	 */

	let id = (row*maze.hor_cells_num) + col

	return id
}

function ID_coord(id, maze){
	/**
	 * This function returns the [row, col] coordinate valves in a list format
	 * 
	 */
	var coord = [Math.floor(id/maze.hor_cells_num),id%maze.hor_cells_num]
	return coord
}

function convertToGraph(maze){
	/**
	 *	create a adjacency list graph represent of the 2d list
	 *
	 *  graph = {
	 *	 0 : [ [cost, 1], [cost,40]  ],
	 *   40 : [ [cost,0] , [cost,41], [cost,80]... ]
	 *  }
	 *
	 * id = row#*(cellsPerRow) + col# 
	 */


	adj_dict = {

	}

	tile_cost = {
		"0": 5,
		"2": 30, // water
		"3": 70, // snow
		"4": 40, // forrest
		"5": 60 // sand
	}

	for (let i=0; i<maze.vert_cells_num; i++){ // i = row
		for (let g=0; g<maze.hor_cells_num; g++){ // g = col

			if (maze.data[i][g] != 1){
				adj_dict[coord_ID(i,g,maze)] = []
				// console.log("added:",coord_ID(i,g,maze) )
			}else{
				continue // go to next tile
			}

			 // left 
			try {
			 if ( (g>0)  &&  maze.data[i][g-1] != 1){
				 //console.log(coord_ID(i, g, maze),"is adding:" , coord_ID(i, g-1, maze))
				 adj_dict[coord_ID(i, g, maze)].push( [tile_cost[maze.data[i][g-1]], coord_ID(i, g-1, maze)]     )
			 }
			}catch(e){}

			 //right
			try{
				if ( (g<maze.hor_cells_num-1) && maze.data[i][g+1] != 1){
				 adj_dict[coord_ID(i, g, maze)].push( [tile_cost[maze.data[i][g+1]], coord_ID(i, g+1, maze)] )
				}
			}catch(e){}

			 //down	
			try{ 
				if ( (i < maze.vert_cells_num-1) && maze.data[i+1][g] != 1){
					adj_dict[coord_ID(i, g, maze)].push( [tile_cost[maze.data[i+1][g]], coord_ID(i+1, g, maze) ] )
				}
			}catch(e){}

			 //up
			try{
				if ( (i-1 >=0) && maze.data[i-1][g] != 1){
					adj_dict[coord_ID(i, g, maze)].push( [tile_cost[maze.data[i-1][g]], coord_ID(i-1, g, maze)])
				}
			}catch(e){}

		}
	}

	return adj_dict

}

// function to find the final route
function shortest_path(visited_dict, end){
	let solved_path = []
	solved_path.unshift(end)
	let a = visited_dict[end] 
	while (a != null){
		solved_path.unshift(a) // add to front of the list
		a = visited_dict[a]
	}
	return solved_path
}


// for testing 
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {myRandom, coord_ID, ID_coord, convertToGraph}
}
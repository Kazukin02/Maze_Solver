if (typeof require !== 'undefined') {
	// no "var" here: the browser already has "class MinHeap" / "class Maze" as globals
	globalThis.MinHeap = require('../utils/minHeap.js');
	require('../maze.js'); // sets the global Maze (see maze.js)
}

function A_star_algorithm(adjacency_list, start_list, target_id, maze = MAZE){
	/***
	 * start_list = [cost, id]
	 *
	 */
	if (adjacency_list === null || adjacency_list === undefined || adjacency_list.constructor !== Object || Object.keys(adjacency_list).length === 0){
		return [ [], [] ]
	}

	if ( !Array.isArray(start_list) || start_list.length != 2){
		return [ [], [] ]
	}

	if (!(maze instanceof Maze)){
		return [ [], [] ]
	}

	var animation_frames = []// store all the visited nodes for next layer

	var shortest = {}
	var visited = {}
	visited[start_list[1]] = null
	let start_id = start_list[1]
	var steps_taken =  {
		// tile_id : steptaken to get to tile_id 
	}

	steps_taken[start_id] = 0
	console.log(steps_taken)

	function man_dist(current, goal){
		// This function returns the manhatten between 2 tiles given their tile id

		// current : integer  => represents the starting tile ID 
		// goal : integer => represents the ending tile ID

		var x_dif = Math.abs(current%10 - goal%10)
		var y_dif = Math.abs( ( Math.floor(current/10) -  Math.floor(goal/10) )  )
		return (x_dif + y_dif)
	}

	var minheap = new MinHeap()
	//                            id      
	minheap.push(  0 , start_list[1] )

	while (minheap.heap.length > 0){

		let framedata = {
			"searched": [], //[ids...]
			"md":[]// [corresponding manhatten distance for each id...]
		}

		let lowest_cost_node = minheap.pop()
		let tile_id = lowest_cost_node[1]
		let tile_cost = lowest_cost_node[0]
		console.log("tileid:",tile_id,"tilecost:" ,tile_cost)

		if ( tile_id in shortest){
			continue
		}
		if (!(tile_id in shortest)){
			shortest[tile_id] = tile_cost
			var neighbors = adjacency_list[tile_id]
			//console.log("neighbors:",neighbors)
			for (let node of neighbors){				
				let node_id = node[1]
				let node_cost = node[0]
				if ( !( node_id in shortest) ){
					//step to current node
					//         total_cost to parent 
					minheap.push(node_cost  + man_dist(node_id, target_id) + steps_taken[tile_id] +1,
											 node_id)
					// console.log("cost of neighbor:", node_cost + tile_cost + man_dist(node_id, target_id) + steps_taken[tile_id] +1,
					// 					 "neighbor:", node)
					steps_taken[node_id] = steps_taken[tile_id] +1
					visited[node_id] = tile_id
					framedata["searched"].push(node_id)
					if (node_id == target_id){
						return[visited, animation_frames]
					}
				}
			} // for loop

		} // if tile_id not in shortest
	console.log(shortest)
	animation_frames.push(framedata)
	}// while 

	return [visited, animation_frames]
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = A_star_algorithm;
}
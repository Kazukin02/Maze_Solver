if (typeof require !== 'undefined') {
	// no "var" here: the browser already has "class MinHeap" / "class Maze" as globals
	globalThis.MinHeap = require('../utils/minHeap.js');
	require('../maze.js'); // sets the global Maze (see maze.js)
}

function dijkstra_shortestpath(adjacency_list, start_list, target_id, maze = MAZE) {
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
	var best_cost = {} // cheapest cost found so far for each tile id
	best_cost[start_list[1]] = start_list[0]
	var visited = {}
	visited[start_list[1]] = null

	var minheap = new MinHeap()
	minheap.push(start_list[0], start_list[1])

	while (minheap.heap.length > 0) {

		let framedata = {
			"searched": [], //[ids...]
			"md": []// [corresponding manhatten distance for each id...]
		}

		let lowest_cost_node = minheap.pop()
		console.log("visiting:", lowest_cost_node)
		let tile_id = lowest_cost_node[1]
		let tile_cost = lowest_cost_node[0]
		if (tile_id in shortest) {
			continue
		}
		if (!(tile_id in shortest)) {
			shortest[tile_id] = tile_cost
			// the cheapest node is popped first, so its cost is final: safe to stop here
			if (tile_id == target_id) {
				return [visited, animation_frames]
			}
			var neighbors = adjacency_list[tile_id]
			console.log("neighbors:", neighbors)
			for (let node of neighbors) {
				let node_id = node[1]
				let node_cost = node[0]
				let new_cost = node_cost + tile_cost
				// only take this route if it is cheaper than the best one seen so far
				if (!(node_id in shortest) && (!(node_id in best_cost) || new_cost < best_cost[node_id])) {
					console.log("adding:", node)
					best_cost[node_id] = new_cost
					minheap.push(new_cost, node_id)
					visited[node_id] = tile_id
					framedata["searched"].push(node_id)
				}
			} // for loop

		} // if tile_id not in shortest
		console.log(shortest)
		animation_frames.push(framedata)
	}// while 

	return [visited, animation_frames]
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = dijkstra_shortestpath;
}



function dijkstra_shortestpath(adjacency_list, start_list, target_id) {
	/*** 
	 * start_list = [cost, id]
	 *
	 */
	var animation_frames = []// store all the visited nodes for next layer

	var shortest = {}
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
			var neighbors = adjacency_list[tile_id]
			console.log("neighbors:", neighbors)
			for (let node of neighbors) {
				let node_id = node[1]
				let node_cost = node[0]
				if (!(node_id in shortest)) {
					console.log("adding:", node)
					minheap.push(node_cost + tile_cost, node_id)
					visited[node_id] = tile_id
					framedata["searched"].push(node_id)
					if (node_id == target_id) {
						return [visited, animation_frames]
					}
				}
			} // for loop

		} // if tile_id not in shortest
		console.log(shortest)
		animation_frames.push(framedata)
	}// while 

	return [visited, animation_frames]
}


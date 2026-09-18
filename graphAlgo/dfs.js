function DFS_path(adjacency_list, start_list, target){
	console.log("executing DFS")
/**
 *
 * start: integers = 0
 *
 * end : integers = 25
 *
 * adjaceny_list  ={
 *  0 : [1 , 47],
 *  1 : [2,0,48]
 * 
 * }
 * 
 */
	var start = parseInt(start_list[1])
	var distance = 0
	var stack = [start]
	var visited = {} 
	var animation_frames = []// store all the visited nodes for next layer


	visited[start] = null  // start 'id' will be converted to a string

	while (stack.length > 0 ){
		let current_node = stack.pop()


		let framedata = {
			"searched": [], //[ids...]
			"md":[]// [corresponding manhatten distance for each id...]
		}
			for (let i of adjacency_list[current_node]){
				let neighbor = i[1]
				// for every nearby neighbor of current node that we've not processed
				if (!( neighbor.toString() in visited) && (!(stack.includes(neighbor)))){
					visited[neighbor] = current_node
					framedata["searched"].push(neighbor) //marking down all the neighbors thats being process

					let [noderow,nodecol] =ID_coord(start, MAZE)
					let [irow, icol]=ID_coord(i, MAZE)
					framedata["md"].push( Math.abs(noderow-irow) + Math.abs(nodecol-icol) )

					if (target==neighbor){
						return [visited, animation_frames]
					}

					stack.push(neighbor)

				}
			}
	
		animation_frames.push(framedata)
		distance += 1
	}
	return [visited, animation_frames]
}
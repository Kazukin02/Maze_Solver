if (typeof require !== 'undefined') {
	var {myRandom, coord_ID, ID_coord, convertToGraph} = require('../utils/helper.js');
}

function BFS_path(adjacency_list, start_list, target, maze = MAZE){
//console.log("executing BFS")
/**
 *
 * start_list: [ cost, id ]
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
	var queue = [[start]]
	var visited = {} 
	var animation_frames = []// store all the visited nodes for next layer


	visited[start] = null  // start 'id' will be converted to a string
	
	while (queue[0].length > 0 ){
		let current_layer = queue.shift()
		//console.log("layer:",current_layer)
		let next_layer = []

		let framedata = {
			"searched": [], //[ids...]
			"md":[]// [corresponding manhatten distance for each id...]
		}
		for (let node of current_layer){ //current_layer = [ 3,2]
			for (let i of adjacency_list[node]){
				let neighbor = i[1]
				// for every nearby neighbor of current node that we've not processed
				if (!( neighbor.toString() in visited) && (!(next_layer.includes(neighbor)))){
					visited[neighbor] = node
					framedata["searched"].push(neighbor) //marking down all the neighbors thats being process

					let [noderow,nodecol] =ID_coord(start, maze)
					let [irow, icol]=ID_coord(i, maze)
					framedata["md"].push( Math.abs(noderow-irow) + Math.abs(nodecol-icol) )
					
					if (target==neighbor){
						return [visited, animation_frames]
					}
					
					next_layer.push(neighbor)
					
				}
			}
		}
		animation_frames.push(framedata)
		queue.push(next_layer)
		distance += 1
	}
	return [visited, animation_frames]
}

if (typeof module !== 'undefined' && module.exports) {
	module.exports = BFS_path;
}
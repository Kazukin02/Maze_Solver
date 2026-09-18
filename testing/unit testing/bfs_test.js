// import assert from 'assert';
// import BFS_path from '../../graphAlgo/bfs.js'
const assert = require('assert')
const BFS_path = require("../../graphAlgo/bfs");
const {myRandom, coord_ID, ID_coord, convertToGraph} = require("../../utils/helper")
const Maze = require("../../maze")



let start_tile = 42;
let end_tile = 247;
let adjacency_graph = {
			"0": [
					[
							5,
							1
					]
			],
			"1": [
					[
							null,
							0
					],
					[
							5,
							2
					]
			],
			"2": [
					[
							5,
							1
					],
					[
							5,
							3
					]
			],
			"3": [
					[
							5,
							2
					],
					[
							5,
							4
					]
			],
			"4": [
					[
							5,
							3
					],
					[
							5,
							44
					]
			],
			"44": [
					[
							5,
							84
					],
					[
							5,
							4
					]
			],
			"81": [
					[
							null,
							82
					],
					[
							5,
							121
					]
			],
			"82": [
					[
							5,
							81
					]
			],
			"84": [
					[
							5,
							124
					],
					[
							5,
							44
					]
			],
			"121": [
					[
							5,
							161
					],
					[
							5,
							81
					]
			],
			"124": [
					[
							5,
							164
					],
					[
							5,
							84
					]
			],
			"161": [
					[
							5,
							162
					],
					[
							5,
							121
					]
			],
			"162": [
					[
							5,
							161
					],
					[
							5,
							163
					]
			],
			"163": [
					[
							5,
							162
					],
					[
							5,
							164
					]
			],
			"164": [
					[
							5,
							163
					],
					[
							5,
							124
					]
			]
	}


var canvasX = 0
var canvasY = 0
var canvasW = 800
var canvasH = 600
var CELLSIZE = 20
var MAZE = new Maze(0,0,800,600,"white", 20)

var maze_sol1 = {0: null, 1: 0, 2: 1, 3: 2, 4: 3, 44: 4, 81: 121, 82: 81, 84: 44, 121: 161, 124: 84, 161: 162, 162: 163, 163: 164, 164: 124}



result = BFS_path(adjacency_graph, [0, 0], 82, maze = MAZE);
var visited = result[0]
var frames = result[1]
var singleFrame = result[1][0]
console.log(singleFrame)
// test 1 : test if BFS return correct traversal by comparing visited neighbors
try {
	assert.deepEqual(visited, maze_sol1); //(BFS output, value to test)
	console.log("passed test 1")
}catch(err){
	if (err.code === 'ERR_ASSERTION'){
		console.log("failed test1")
		console.log("-------------")
		console.log(err.actual)
		console.log(err.expected)
	}
}


//test 2: test BFS animation frames data schema
/**
 *[ {"searched":[1],"md":[null]},
 *   {"searched":[2],"md":[null]},
 *  {"searched":[3],"md":[null]},
 *  {"searched":[4],"md":[null]}
 * ]
 * 
 */

var z = require("zod")

//define schema 
const itemSchema = z.array(z.string());


var result = itemSchema.safeParse(['a','b','c'])
var result2 = itemSchema.safeParse([1,'b','c'])

console.log(result)
//sample data to test 

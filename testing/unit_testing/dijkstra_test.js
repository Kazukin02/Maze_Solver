const assert = require('assert')
const z = require("zod")
const dijkstra_shortestpath = require("../../graphAlgo/dijstras")
const Maze = require("../../maze")

// graph format: id : [ [cost, neighbor_id], ... ]
let adjacency_graph = {
	"0": [[5, 1]],
	"1": [[5, 0], [5, 2]],
	"2": [[5, 1], [5, 3]],
	"3": [[5, 2], [5, 4]],
	"4": [[5, 3], [5, 44]],
	"44": [[5, 4]]
}

var MAZE = new Maze(0, 0, 800, 600, "white", 20)
var failed = 0

function runTest(name, fn){
	try {
		fn()
		console.log("passed " + name)
	} catch(err){
		failed++
		if (err.code === 'ERR_ASSERTION'){
			console.log("failed " + name)
			console.log("-------------")
			console.log("what you got:", err.actual)
			console.log("expected:", err.expected)
		}else{
			console.log("Error while doing " + name + " for dijkstra_shortestpath()", err)
		}
	}
}


// test 1 : normal graph, visited should hold the parent of every node reached
runTest("test 1: normal graph traversal", () => {
	var expected = {0: null, 1: 0, 2: 1, 3: 2, 4: 3, 44: 4}
	var result = dijkstra_shortestpath(adjacency_graph, [0, 0], 44, MAZE)
	assert.deepEqual(result[0], expected)
})

// test 2 : cheaper route wins over a shorter (fewer steps) but costlier route
runTest("test 2: picks the lowest cost route", () => {
	var graph = {
		"0": [[50, 3], [5, 1]],
		"1": [[5, 0], [5, 2]],
		"2": [[5, 1], [5, 3]],
		"3": [[50, 0], [5, 2]]
	}
	var result = dijkstra_shortestpath(graph, [0, 0], 3, MAZE)
	assert.equal(result[0][3], 2)
})

// test 3 : animation frame schema
runTest("test 3: animation frame schema", () => {
	var result = dijkstra_shortestpath(adjacency_graph, [0, 0], 44, MAZE)
	var frames = result[1]
	assert.ok(frames.length > 0)
	for (let frame of frames){
		assert.deepEqual(Object.keys(frame).sort(), ["md", "searched"])
		assert.ok(Array.isArray(frame.searched))
		assert.ok(Array.isArray(frame.md))
		assert.ok(frame.searched.every(Number.isInteger))
	}
})

// test 4 : empty graph
runTest("test 4: empty graph", () => {
	var result = dijkstra_shortestpath({}, [0, 0], 82, MAZE)
	assert.deepEqual(result[0], [])
	assert.deepEqual(result[1], [])
})

// test 5 : not a Maze object
runTest("test 5: invalid Maze object", () => {
	var result = dijkstra_shortestpath(adjacency_graph, [0, 0], 44, 123)
	assert.deepEqual(result[0], [])
	assert.deepEqual(result[1], [])
})

// test 6 : null inputs
runTest("test 6: null inputs", () => {
	var result = dijkstra_shortestpath(null, null, null, null)
	assert.deepEqual(result[0], [])
	assert.deepEqual(result[1], [])
})

// test 7 : bad start_list
runTest("test 7: bad start_list", () => {
	var result = dijkstra_shortestpath(adjacency_graph, [0], 44, MAZE)
	assert.deepEqual(result[0], [])
	assert.deepEqual(result[1], [])
})

// test 8 : data schema of the full output [visited, animation_frames]
runTest("test 8: output data schema", () => {
	const frameSchema = z.object({
		"searched": z.array(z.number()),
		"md": z.array(z.union([z.number(), z.nan()]))
	})
	const outputSchema = z.tuple([
		z.record(z.string(), z.number().nullable()), // visited : { id : parent_id | null }
		z.array(frameSchema)                          // animation_frames
	])

	var result = dijkstra_shortestpath(adjacency_graph, [0, 0], 44, MAZE)
	var parsed = outputSchema.safeParse(result)
	assert.equal(parsed.success, true, parsed.success ? "" : JSON.stringify(parsed.error.issues))
	assert.strictEqual(result[0][0], null) // the start tile has no parent
})

process.exitCode = failed > 0 ? 1 : 0

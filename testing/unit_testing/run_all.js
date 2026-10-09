// Runs every *_test.js file in this folder and exits with 1 if any of them fail.
// A test file fails if it crashes, exits with a non-zero code, or prints a
// line starting with "failed" / "Error while" (bfs_test.js only logs failures).
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const testFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('_test.js')).sort()
var failedFiles = []

for (let file of testFiles){
	console.log("\n===== " + file + " =====")
	let run = spawnSync(process.execPath, [path.join(__dirname, file)], { encoding: 'utf8' })
	let output = (run.stdout || "") + (run.stderr || "")
	let passed = (output.match(/^passed/gm) || []).length
	let loggedFailure = /^(failed|Error while)/m.test(output)

	if (run.status !== 0 || loggedFailure){
		failedFiles.push(file)
		console.log(output) // show the full output only when something went wrong
	}
	console.log(file + ": " + passed + " passed, " + (run.status !== 0 || loggedFailure ? "FAILED" : "no failures"))
}

console.log("\n" + (testFiles.length - failedFiles.length) + "/" + testFiles.length + " test files OK")
if (failedFiles.length > 0){
	console.log("failed files: " + failedFiles.join(", "))
}
process.exitCode = failedFiles.length > 0 ? 1 : 0

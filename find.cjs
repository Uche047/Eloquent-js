const {roadGraph} = require("./roads.cjs");
const {find_path} = require("dijkstrajs");
console.log(roadGraph);
let graph = {};
for (let node of Object.keys(roadGraph)) {
	let edges = graph[node] = {};
	
	for (let dest of roadGraph[node]) {
		edges[dest] = 1;
	}
}
console.log(graph);
console.log(find_path(graph, "Post Office", "Town Hall"));
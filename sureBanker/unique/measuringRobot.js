/*<!DOCTYPE html>
<html>
<head>
	<title>compareRobots</title>
	<meta charset="utf-8">
</head>
<body>
	<script type="text/javascript">*/
               
		const roads = [
		"Alice's House-Bob's House", "Alice's House-Cabin",
		"Alice's House-Post Office", "Bob's House-Town Hall",
		"Daria's House-Ernie's House", "Daria's House-Town Hall",
		"Ernie's House-Grete's House", "Grete's House-Farm",
		"Grete's House-Shop", "Marketplace-Farm",
		"Marketplace-Post Office", "Marketplace-Shop",
		"Marketplace-Town Hall", "Shop-Town Hall"
		];

		function buildGraph(edges){
			let graph = Object.create(null);
			function addEdge(from,to) {
				if (graph[from] == null) {
					graph[from] = [to];
				} else {
					graph[from].push(to);
				}
			}
			for(let [from,to] of edges.map(r => r.split('-'))){
				addEdge(from,to);
				addEdge(to,from);
			}
			return graph;
		}

		const roadGraph = buildGraph(roads);
		console.log(roadGraph);

		class VillageState {
			constructor(place,parcels){
				this.place = place;
				this.parcels = parcels;
			}
			move(destination){
				if (!roadGraph[this.place].includes(destination)){
					return this;
				}else{
					let parcels = this.parcels.map(p => {
						if(p.place != this.place) return p;
						return {place:destination,address:p.address};
					}).filter(p => p.place != p.address);
					let b = new VillageState(destination,parcels);
					console.log('checking parcels delivery progress');
					console.log(b.parcels);
					return b;
				}
			}

		}

		

		function runRobot(state, robot, memory){
			for (let turn =0; ; turn++) {
				console.log(`turn ${turn + 1}`);
				if(state.parcels.length == 0) {
					console.log(`Done in ${turn} turns`);
					numTurns = turn;
					return numTurns;
					
				}
				let action = robot(state,memory);
				state = state.move(action.direction);
				memory = action.memory;
				console.log(`Moved to ${action.direction}`);
			}
		}

		function randomPick(array){
			let choice = Math.floor(Math.random() * array.length);
			return array[choice];
		}

		function randomRobot(state){
			console.log('Checking first move direction');
			let randomDirection = {direction:randomPick(roadGraph[state.place])};
			console.log(`Current place is ${state.place}`);
			console.log(randomDirection); 
			return randomDirection;
		}
		
		VillageState.random = function(parcelCount = 5) {
			let parcels = [];
			for (let i = 0; i < parcelCount; i++){
				let address = randomPick(Object.keys(roadGraph));
				let place;
				do {
					place = randomPick(Object.keys(roadGraph));
				} while (place == address);
				parcels.push({place,address});
			}

		
			let v = new VillageState("Post Office", parcels);
			console.log('Parcels from random village state');
			console.log(v.parcels);
			console.log('Place from random village state');
			console.log(v.place);
			return v;
		};

		const mailRoute = ["Alice's House", "Cabin", "Alice's House", "Bob's House",
			"Town Hall", "Daria's House", "Ernie's House",
			"Grete's House", "Shop", "Grete's House", "Farm",
			"Marketplace", "Post Office"];

		function routeRobot(state, memory) {
			if (memory.length == 0){
					memory = mailRoute;
			}
			console.log(`Current place is ${state.place}`);
			return {direction: memory[0], memory: memory.slice(1)};
		}

		function findRoute(graph, from , to){
			let work = [{at:from, route:[]}];
			
			for (let i = 0; i < work.length; i++) {
				let {at, route} = work[i];
				console.log(`at is ${at} and to is ${to} index${i}`);
				console.log(work.length);
				for (let place of graph[at]) {
					if (place == to ){
						console.log('Last work = ',work);
						let r = route.concat(place);
						console.log('Returned route is', r); 
						return r;
					} 

					if (!work.some(w => w.at == place)) {
						work.push({at: place, route:route.concat(place)});
					}
				console.log('First work = ',work);	
				}
			}
			
		}

		function goalOrientedRobot(state, route){
			if (route.length == 0) {
				console.log('state.parcels is ',state.parcels);
				let parcel = state.parcels[0];
				console.log(parcel);
				console.log(state.place);
				if (parcel.place != state.place) {
					route = findRoute(roadGraph, state.place, parcel.place);
				}else {
					route = findRoute(roadGraph, state.place, parcel.address);
				}
			}
			return {direction: route[0], memory: route.slice(1)};
		}

		//runRobot(VillageState.random(), routeRobot, mailRoute);
		//runRobot(VillageState.random(), goalOrientedRobot, []);

		function compareRobots(robot1,memory1,robot2,memory2){
			let turns1 = 0;
			let turns2 = 0;
			for (let i=0; i < 100; i++) {
				let result1 = runRobot(VillageState.random(), robot1, memory1);
				turns1 += result1;
				let result2 = runRobot(VillageState.random(), robot2, memory2);
				turns2 += result2;
			}
			let averageSteps1 = turns1/100;
			let averageSteps2 = turns2/100;
			console.log('Robot1 had an average of',averageSteps1);
			console.log('Robot2 had an average of', averageSteps2);
		}

		compareRobots(routeRobot, mailRoute,goalOrientedRobot, []);


	/*</script>

</body>
</html>*/
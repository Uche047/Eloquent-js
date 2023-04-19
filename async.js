var bigOak = require("./crow-techs.cjs").bigOak;
var defineRequestType = require("./crow-techs.cjs").defineRequestType;
var Timeout = class Timeout extends Error {};
var everywhere = require("./crow-techs.cjs").everywhere;

//fourteen.then(f => console.log(`It's another one ${f} bucks`));
function storage(nest, name){
	return new Promise(resolve => {
		nest.readStorage(name, result => {
			console.log(result);
			resolve(result);
		});
	});
};

//storage(bigOak, 'enemies').then(value => console.log(`Got ${value}`));
//storage(bigOak, 'food caches').then(value => console.log("Its another one", value));

//console.log(bigOak)
new Promise((_, reject) => reject(new Error("Failed")))
	.then(value => console.log("Handler 1"))
	.catch(reasons => {
		//console.log("Caught failure blaa " + reasons)
		return "nothing"
	})
	.catch(reason => {
		console.log("Caught failured blaa " + reason)
		return "nothings"
	})

//.then(value => console.log("Handler 2", value))
//.then(values => console.log("Handler 3", values))
//.then(values => console.log("Handler 4", values))

//class Timeout extends Error {}
function finished(failure,response){
	if (failure) return("hi");
}

function request(nest, target, type, content) {
	return new Promise((resolve, reject) => {
		let done = false;
		function attempt(n){
			nest.send(target, type, content, (failed, value) => {
				done = true;
				//console.log('First', done)
				if (failed) reject(failed);
				else resolve(value);
			});
			setTimeout(() => {
				//console.log("Second", done)
				if (done) return;
				else if (n < 3) attempt(n + 1);
				else reject(new Timeout("Timed out"));
			}, 250);
		}
		attempt(1); 
	});
}

function requestType(name, handler) {
	defineRequestType(name,(nest, content, source, callback) => {
		try {
			Promise.resolve(handler(nest, content, source))
				.then(response => callback(null, response),failure => callback(failure));
		} catch (exception) {
			callback(exception);
		}
	});
}



//let message ,exceptFor;
everywhere(nest => {
	nest.state.gossip = [];
});
function sendGossip(nest,message,exceptFor = null) {
	nest.state.gossip.push(message);
	for (let neighbor of nest.neighbors) {
		if (neighbor == exceptFor) continue;
		request(nest, neighbor, "gossip", message);
	}
}


requestType("gossip", (nest,message, source) => {
	if (nest.state.gossip.includes(message)) return;
	console.log(`${nest.name} received gossip '${message}' from ${source}`);
	sendGossip(nest, message, source);
});

//sendGossip(bigOak, 'Jesus is Lord');
//sendGossip(bigOak, 'Jesus is coming soon');

requestType('connections', (nest, {name, neighbors}, source) => {
	let connections = nest.state.connections;
	//console.log(JSON.stringify(connections.get(name)) == JSON.stringify(neighbors));
	if (JSON.stringify(connections.get(name)) == JSON.stringify(neighbors)) return ;
	
	connections.set(name, neighbors);
	//console.log(cowPasture.state.connections);
	console.log('2',bigOak.state.connections);
	//console.log(name, neighbors);
	broadcastConnections(nest, name, source);
	//console.log(connections);

});


function broadcastConnections(nest, name, exceptFor = null){
	for (let neighbor of nest.neighbors) {
		//console.log(exceptFor);
		if (neighbor == exceptFor) continue;
		request(nest, neighbor, "connections", {
			name,
			neighbors: nest.state.connections.get(name)
		});
	}
}

everywhere(nest => {
	//console.log(nest);
	nest.state.connections = new Map;
	nest.state.connections.set(nest.name, nest.neighbors);
	broadcastConnections(nest, nest.name,null);
});
/*
for(let nest of  Object.values(networks.nodes)){
	broadcastConnections(nest, nest.name,null);
}
*/
console.log('2',bigOak.state.connections);
function findRoute(from, to , connections) {
	let work = [{at:from, via:null}];
	for (let i = 0; i < work.length; i++) {
		//console.log(i);
		//console.log(work);
		let {at, via} = work[i];
		//console.log('Currently at ',at);
		for (let next of connections.get(at) || []) {
			if (next == to) {
				//console.log('next',next, 'via',via, 'to', to);
				return via;
			}
			if (!work.some(w => w.at == next)) {
				work.push({at: next, via: via || next});
			}
		}
	}
	//console.log(work)
	return null;
}
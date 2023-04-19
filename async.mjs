import {bigOak} from "./crow-tech.js";
import {butcherShop} from "./crow-tech.js";
import {greatPine} from "./crow-tech.js";
import {woods} from "./crow-tech.js";
import {cowPasture} from "./crow-tech.js";
import {gillesGarden} from "./crow-tech.js";
import {hawthorn} from "./crow-tech.js";
import {networks} from "./crow-tech.js";
import {storages} from "./crow-tech.js";
import {defineRequestType} from "./crow-tech.js";
import {everywhere}  from "./crow-tech.js";


/*bigOak.readStorage("food caches", caches => {
	let firstCache = caches[1];
	bigOak.readStorage(firstCache, info => {
		console.log(info);
	});
});
defineRequestType("note", (cows = cowPasture, content = 'biggy', bigOak, done) => {
	console.log(cows.name,'received note:', content);
	console.log("Hi");
	//done();


});
bigOak.send("Butcher Shop", "note", "Let's caw loudly at 7PM",() => console.log("Note delivered."));
*/
//let fourteen = Promise.resolve(140);
//fourteen.then(g => console.log(`Got ${g *5}`));
//fourteen.then(f => console.log(`It's another one ${f} bucks`));
function storage(nest, name){
	return new Promise((resolve,reject )=> {
		nest.readStorage(name, result => {
			//console.log(result);
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

class Timeout extends Error {}
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
				.then(response => callback(null, response),failure => callback(failure))
	
		} catch (exception) {
			callback(exception);
		}
	});
}


requestType("note",(cows = cowPasture, content = 'biggy', bigOak, callback = (failure, value) => {
	if (failure) return "failed"
	else console.log("registered") 
	
} ) => {
	console.log(cows.name,'received note:', content)});
	

//request(bigOak,"Butcher Shop", "note", "Let's caw loudly at 7PM");

requestType("ping", () => {
	"pong";
	//console.log("pong");
});

function availableNeighbors(nest) {
	let requests = nest.neighbors.map(neighbor => {
		return request(nest, neighbor, "ping")
			.then(() => true, () => false);
	});
	//console.log(requests);
	//Promise.all(requests).then(result => {console.log(result);});
	return Promise.all(requests).then(result => {
		//console.log(nest.neighbors.filter((_,i) => result[i]));
		return nest.neighbors.filter((_,i) => result[i]);
	});
}

availableNeighbors(bigOak)


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
	//console.log('2',bigOak.state.connections);
	//console.log(name, neighbors);
	broadcastConnections(nest, name, source);
	//console.log(connections);
	//chicks(bigOak,2001);
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
//console.log('2',gillesGarden.state.connections);
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

/*function routeRequest(nest, target, type, content) {
	if (nest.neighbors.includes(target)) {
		//console.log('Check 1');
		//console.log(target, 'is if target');
		//console.log('Route request',content);
		return request(nest, target, type, content);
	} else {
		let via = findRoute(nest.name, target, nest.state.connections);
		//console.log(via , 'why');
		if (!via) throw new Error(`No route to ${target}`);
		//console.log(via, 'is else target');
		return request(nest, via, type, content);
	}
}*/

function routeRequest(nest, target, type, content) {
if (nest.neighbors.includes(target)) {
return request(nest, target, type, content);
} else {
let via = findRoute(nest.name, target,
nest.state.connections);
if (!via) throw new Error(`No route to ${target}`);
return request(nest, via, "route",
{target, type, content});
}
}

//console.log(gillesGarden.neighbors);
/*
requestType("route", (nest , content) =>{
	//console.log('this is nest name', nest.name);
	//console.log('RequestType target is' , content.target);
	//console.log(content);
	if (content.target == nest.name ) {
		console.log( `Got message ${content.content}`);
		return;
	}

	else return routeRequest(nest, content.target, content.type, content);
});
*/


requestType("route", (nest, {target, type, content}) => {
return routeRequest(nest, target, type, content);
});
//routeRequest(gillesGarden,  'Big Oak', 'route', {target :  'Hawthorn', type:"route", content :'hi'});
//routeRequest(bigOak,  'Cow Pasture', 'route', 'Hello');
requestType("storage", (nest, name) => storage(nest, name));
//const $storage = Symbol("storage");
//console.log(cowPasture[storages]);
//console.log(hawthorn[storages]);
//console.log(bigOak[storages]['chicks in 1985']);
//console.log(bigOak.neighbors);

/*function findInStorage(nest, name) {
	return storage(nest, name).then(found => {
		if (found != null){ 
			return found;
		}
		else return findInRemoteStorage(nest, name);
	});
}*/

function network(nest) {
	//console.log(Array.from(nest.state.connections.keys()));
	return Array.from(nest.state.connections.keys());
}

/*function findInRemoteStorage(nest, name) {
	let sources = network(nest).filter(n => n != nest.name);
	function next() {
		console.log(sources);
		if (sources.length == 0) {
			return Promise.reject(new Error("Not found"));
		} else {
			let source = sources[Math.floor(Math.random() * sources.length)];
			sources = sources.filter(n => n != source);
			return routeRequest(nest, source, "storage", name)
				.then(value => value != null ? value : next(), next);
		}
	}
	return next();
}*/

async function findInStorage(nest,name){
	let local = await storage(nest, name);
	if (local != null) return local;

	let sources = network(nest).filter(n => n != nest.name);
	while (sources.length > 0) {
		let source = sources[Math.floor(Math.random() * sources.length)];
		sources = sources.filter(n => n != source);

		try {
			let found = await routeRequest(nest, source, "storage", name);
			if (found != null) return found;
		} catch (_) {}
	}
	throw new Error('Not found');

}

function anyStorage(nest, source, name) {
	if(source == nest.name) return storage(nest, name);

	else return routeRequest(nest, source, "storage", name);
}

/*async function chicks(nest, year) {
	let list = "";
	await Promise.all(network(nest).map(async name => {
		 list += `${name}: ${
			await anyStorage(nest, name, `chicks in ${year}`)
		}\n`;
		console.log(list);
	}));
	return list;

}*/
async function chicks(nest, year) {
	let lines = network(nest).map(async name => {
		return name + ": " + await anyStorage(nest, name, `chicks in ${year}`);
	});
	return await Promise.all(lines).then(x => console.log(x));
	//return (await Promise.all(lines)).join("\n");
}

//chicks(bigOak,2001);
//findInStorage(gillesGarden, "events on 2017-12-21");

//console.log(networks.nodes);

//console.log(3, gillesGarden);

 async function locateScalpel(name) {
	for(let nest of  Object.values(networks.nodes)){
		let check = await storage(nest, name);
		//console.log(1, nest.name);
		if (check == undefined) return Promise.reject(new Error(`Scalpel not found`)).catch(reason => console.log(reason))
		if (check == nest.name){
			console.log(`Scapel found at ${nest.name}`);
			return check;

		}
	}
}


 /* function locateScalpel(name) {
  	return new Promise((resolve,reject) => {
  		let check;
		for(let nest of  Object.values(networks.nodes)){
			let list = [];
			check = storage(nest, name).then(x => {list.push(x)}, failure => console.log(failure));

			
			setTimeout(()=>{
				// Ensuring that we wait for the promise to resolve to a value before comparison
				//console.log(list[0]);
				if (list[0] == undefined) {
					//Promise.reject(new Error("Object requested not in storage")).catch(reason => console.log(reason));
					reject(check)				}
				else {
					// Checking if scalpel has been located and consoling out the nest name if found
					if (list[0] == nest.name){
						console.log(`Scapel found at ${nest.name}`);
					}
					resolve(check);

			}
			
				
			},20)
		
		
		
	}	
  	})
	


}
*/
/*try {
	locateScalpel('scalpe');	
}
catch(exc){console.log(exc)}*/
locateScalpel('scalpe')
//console.log(woods);
//locateScalpel('scalpel').then(x=> x)
//.catch(X => console.log('Scalpel not located'))
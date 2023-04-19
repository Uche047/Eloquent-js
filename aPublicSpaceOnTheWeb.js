const {createServer} = require("http");
const {parse} = require("url");
const {resolve, sep} = require("path");
const {createReadStream} = require("fs");
const {stat, readdir} = require("fs").promises;
const mime = require("mime");
const {createWriteStream} = require("fs");
const {rmdir, unlink} = require("fs").promises;
const {mkdir} = require("fs").promises;

const baseDirectory = process.cwd();




const methods = Object.create(null);

createServer((request, response) => {
	console.log("I am running fine");
	let handler = methods[request.method] || notAllowed;
	handler(request)
	  .catch(error => {
	  	if (error.status != null) return error;
	  	return {body: String(error), status: 500};
	  })
	  .then((body, status=200, type = "application/pdf") => {
	  	response.writeHead(status, {"Content-Type": "type"});
	  	if (body && body.pipe) {
	  		console.log("hi");
	  		body.pipe(response);
	  		
	  	}
	  	else {
	  		console.log(typeof(body));
	  		
	  		response.end(body);

	  	}
	  })
	  .catch(error => {
          throw error;
	  } );
}).listen(8000);

async function notAllowed(request) {
	return {
		status: 405,
		body: `Method ${request.method} not allowed.`
	}
}



function urlPath(url) {
	let {pathname} = parse(url);
	let path = resolve(decodeURIComponent(pathname).slice(1));
	if (path != baseDirectory && 
		!path.startsWith(baseDirectory + sep)) {
		throw "403";
	}
	return path;
}



methods.GET = async function(request) {
let path = urlPath(request.url);
console.log(path);
let stats;
try {
stats = await stat(path);
} catch (error) {
if (error.code != "ENOENT") throw error;
else return "File not found";
}
if (stats.isDirectory()) {
return  (await readdir(path)).join("\n");
} else {
return createReadStream(path);

}
};




methods.DELETE = async function(request) {
	let path = urlPath(request.url);
	let stats;
	try {
		stats = await stat(path);
	} catch (error) {
		if (error.code != "ENOENT") throw error;
		else return "status: 204";
	}
	if (stats.isDirectory()) await rmdir(path);
	else await unlink(path);
	return "status: 204";
}



function pipeStream(from, to) {
	return new Promise((resolve, reject) => {
		from.on("error", reject);
		to.on("error", reject);
		to.on("finish", resolve);
		from.pipe(to);
	});
}

methods.PUT = async function(request) {
	let path = urlPath(request.url);
	await pipeStream(request, createWriteStream(path));
	return "status:204";
}

// Implementing the Make collection Method for creating directories
methods. MKCOL = async function(request) {
	let path = urlPath(request.url);
	let stats;
	try {
		stats = await stat(path);
	} catch (error) {
		// Throws an error if the error is not about if the path exists
		if (error.code != "ENOENT") throw error;
		else {
			//Creating Directory
			await mkdir(path);
			return "status: 200"
		}
	}
	if (stats.isDirectory()) return "status: 204";
	// If the stats object returns a non directory file return a bad request response
	else return "status : 400(Bad Request)";
}


const {request} = require("http");
request({
	hostname: "localhost",
	port: 8000,
	path: "/sureBanker",
	method: "MKCOL"
}, response => {
	//response.on("data", chunk => 
		//process.stdout.write(chunk.toString()));
	//console.log();
}).end()



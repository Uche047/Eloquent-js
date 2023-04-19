import {networks} from "./crow-tech.js";

function storage(nest, name){
	return new Promise((resolve,reject )=> {
		nest.readStorage(name, result => {
			//console.log(result);
			resolve(result);
		});
	});
};

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

	// My non async implementation of the same function
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
locateScalpel('scalpel')
//console.log(woods);
//locateScalpel('scalpel').then(x=> x)
//.catch(X => console.log('Scalpel not located'))
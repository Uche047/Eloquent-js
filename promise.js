// This function creates a promise that produces a value after n milliseconds
// It creates promises that produces values after a limit of 9999 milliseconds
function createPromise(n){
	if (n > 9999) return new Promise((resolve,reject) => {
		setTimeout(()=> {
			resolve(`You requested we get to you after ${n} secs.We promise to get to you after 9999 secs as this is our limit please bear with us`);
		},9999)
	})
	return new Promise((resolve, reject)=> {
		setTimeout(()=>{
			resolve(`We promise to get to you after ${n} secs `);
		},n)
	})
	
}
/*
let ulist = ['b'];
let b = createPromise(5666)
//let y = b.then(c => console.log(c));
//console.log(b);
let r = ulist.map(c => {return b.then(c => c)});


//console.log(r);
*/
// Simulating the regular Promise.all functionality in JavaScript
function promise_all(array) {
	// returning a rejected promise for empty arrays
	if (array.length == 0) return Promise.reject(new Error("Array length Zero")).catch(reason => console.log(reason));
	return new Promise((resolve, reject) => {
		setTimeout(() => { 
			let list = [];
			for (let i = 0; i < array.length; i++) {
				array[i].then(result => {
				list.push(result);
				});
			}
			// Inner timeout to check if all the input promises resolved at the alloted time
			// And immediately checks if the new list is not less than input array
			// If check fails it throws a timeout error and otherwise resolves the list
			setTimeout(()=>{
				if (list.length < array.length) reject(new Error('Timed Out'));
				resolve(list);
			},1)
			
			
		},10000)
		
	})
	
}
promise_all([createPromise(4500), createPromise(9000), createPromise(6000) , createPromise(11000)])
.then(x => console.log(x), failure => console.log(failure));
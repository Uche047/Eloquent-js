console.log("Start");

setTimeout( () => {
	console.log('We are experiencing some delay and hence this code ran at a later time');
}, 5000);

function loginUser(email, password, callback) {
	setTimeout(() => {
		console.log('We have the data now',email);

		return callback({'email':email});
	},5000)
}


const user = loginUser('patrickuche047@gmail.com', 5666, (info) => {
	console.log(info.email);
} );
//console.log(user);
console.log("End");
const list = [5, 6.5, 0];
list.forEach(item => {
	console.log(item);
});
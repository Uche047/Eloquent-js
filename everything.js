function every(array, test){
	for (let item of array){
		console.log(item);
		let check = test(item);
		console.log(check);
		if (check == false) {
			return false;
		}
	}
	return true;
}

function every(array, test){
	return (!array.some(element => !test(element)));
}
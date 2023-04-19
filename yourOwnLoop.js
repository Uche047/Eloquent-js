// Test for valid values
function test(value) {
	if (value) return true;
	else return false;
}

function body(value){return update(value);}

// Appends e to every single value
function update (value){
	let newValue = value + 'e';
	return newValue;
}
// Loops through first argument and returns a list of all items in value
function loop(value, test, update , body){
	var list = [];
	for( let item of value){
		var check = test(item);
		if (check){
			arr = body(item);
			list.push(arr);
		} 
		else break;
	}
	return list;
}

// Thus function checks the dominant writing direction of a text
// Working at a higher level or astraction
// functions characterScript, reduce, countBy, map, filter are used as defined in Eloquent Javascript
// This function can be said to be derived from the textScripts  function
// By returning script.direction instead of script.name to the countBy function
// The countBy returns the dominant direction for the name key and counts the number of times each unique direction appears
// The total number of directions is computed using reduce 
// Map function is used to return results in string form and as percentages indicating the dominant direction in the text.
function dominantDirection(text) {
	let scripts = countBy(text, char => {
		let script = characterScript(char.codePointAt(0));
		return script ? script.direction : "none";
	}).filter(({name}) => name != "none");
	let total = scripts.reduce((n, {count}) => n + count, 0);
	if (total == 0) return "No scripts found";
	return scripts.map(({name, count}) => {
		return `${Math.round(count * 100 / total)}% ${name}`;
	}).join(", ");}
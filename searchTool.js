const {readFile} = require("fs").promises;
const {readFileSync} = require("fs");
const {statSync} = require("fs");
const {readdirSync} = require("fs");
let re1 = new RegExp(process.argv[2]); // Creates a regex expression used to match the keyword in searches within files
let fileMatches = [];

// This Recursive function takes a list containing files to read and directories to search for files in
function readContent(list, dirname=null) {
	// Stores directories to search for files every time readContent is called
	let directoryMatches = [];

	for (let item of list ) {
        // Checking if directory name is not null which means we are searching a directory below the base directory

		if (dirname != null) {
			// Reading a file
			if (!statSync(dirname  + "/" + item).isDirectory()) {
				//console.log("Reading file");
				// Checking for matches
				if (re1.test(readFileSync(dirname + "/" + item, "utf8"))){
					fileMatches.push(dirname + "\\" + item)
				}
			}
			else {
				//console.log("Storing Directory to check", {dirname,item});
				directoryMatches.push({dirname,item});
			}
		}
        // We are at the base directory
		else if (dirname == null) {
			// Reading a file
			if (!statSync(item).isDirectory()) {
				//console.log("Reading file");
				// Checking for matches
				if (re1.test(readFileSync(item, "utf8"))){
					fileMatches.push(item)
				}
			}
			else {
				//console.log("Storing Directory to check", {dirname,item});
				// Note item is the current directory and dirname is the directory above
				directoryMatches.push({dirname,item});
			}
		}
	}	   
	// Checks if there are no more inner directories to search for the path followed
	if (directoryMatches.length == 0) {
		return
	}
	else {
		// Looping through directories found to read them
		for (let {dirname,item} of directoryMatches){
			let result, newdirname; // newdirname represents the path for the directories above to the current directory
			// Reading a directory at the base directory
			if (dirname == null){
				newdirname = item
				console.log("Reading Directory:", process.cwd() +"\\" + item)
				result = readdirSync(process.cwd() +"\\" + item);	
			}
			// Reading a directory at the below base directory
			else {
				newdirname = dirname + "\\" + item;
				console.log("Reading Directory:", process.cwd() +"\\"+ dirname + "\\" + item);
				result = readdirSync(process.cwd() +"\\"+ dirname + "\\" + item);
			}
			// The recursive function is called again giving it a list containing results from reading a directory
			// and an updated path so that files deeper can be read
			readContent(result,newdirname);
		}	
	}
}
// process.argv.slice(3) Represents the list containing files as well as directories to search
readContent(process.argv.slice(3))

if (fileMatches.length > 0) console.log(fileMatches);
else console.log("Sorry no match");


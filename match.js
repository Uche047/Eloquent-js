let c = /(#.*|\s*)/;
console.log(c.exec(`  
	#seslll,h455
	 # dance
	glory
	# hyyyy,
`)[0].length);
function parseExpression(program) {
	program = skipSpace(program);
	let match, expr;
	if (match = /^"([^"]*)"/.exec(program)) {
		//console.log(1,match);
		expr = {type: "value", value:match[1]};		
	} else if (match = /^\d+\b/.exec(program)) {
		expr = {type: "value", value: Number(match[0])};
		//console.log(2,match);
	} else if (match = /^[^\s(),#"]+/.exec(program)) {
		expr = {type: "word", name: match[0]};
		//console.log(3,match);
	} else {
		throw new SyntaxError("Unexpected syntax: " + program);
	}
	//console.log(expr);
	//console.log('Program in parseExpression',program, program.slice(match[0].length) );
	return parseApply(expr, program.slice(match[0].length));
} 

function skipSpace(string) {
	let comment = /(#.*|\s*)*/.exec(string); // Adding support for comments in egg language 
	// Comments start with "#"
	// No comments or spaces do nothing
	if (comment[0].length == 0) return string;
	// Slice up matches for space , newlines and comments which start with '#'
	else{
		return string.slice(comment[0].length)
	}
}

function parseApply(expr, program) {
	program = skipSpace(program);
	if (program[0] != "(") {
		//console.log(program, expr, 'hey');
		return {expr: expr, rest: program};
	}

	program = skipSpace(program.slice(1));
	//console.log('Program passed to parseApply current value is before the while loop: ', program);
	expr = {type: "apply", operator: expr, args: []};
	//console.log('Expression in parseApply before the while loop',expr);
	while (program[0] != ")") {
		let arg = parseExpression(program);
		//console.log('arg in while loop', arg);

		expr.args.push(arg.expr);
		program = skipSpace(arg.rest);
		//console.log(1,program);
		//console.log('Expression in parseApply', expr);
		if (program[0] == ",") {
			program = skipSpace(program.slice(1));
			//console.log(2,program);
		} else if (program[0] != ")") {
			throw new SyntaxError("Expected ',' or ')'");
		}
	}
	return parseApply(expr, program.slice(1));
} 

function parse(program) {
	let {expr, rest} = parseExpression(program);
	if (skipSpace(rest).length > 0) {
		throw new SyntaxError("Unexpected text after program");
	}
	return expr;
}

const specialForms = Object.create(null);

function evaluate(expr, scope) {
	//console.log('check',expr);
	if (expr.type == "value") {
		return expr.value;
	} else if (expr.type == "word") {
		if(expr.name in scope) {
			return scope[expr.name];
		} else {
			throw new ReferenceError(`Undefined binding: ${expr.name}`);
		}
	} else if (expr.type == "apply") {
		let {operator, args} = expr;
		if (operator.type == "word" && operator.name in specialForms) {
			return specialForms[operator.name](expr.args, scope);
		} else {
			let op = evaluate(operator, scope);
			if (typeof op == "function") {
				return op(...args.map(arg => evaluate(arg, scope)));
			} else {
				throw new TypeError("Applying a non-function.")
			}
		}
 	}
}

specialForms.if = (args, scope) => {
	if (args.length != 3) {
		throw new SyntaxError("Wrong number of args to if");
	} else if (evaluate(args[0], scope) != false) {
		return evaluate(args[1], scope);
	} else {
		return evaluate(args[2], scope);
	}
}

specialForms.while = (args, scope) => {
	if (args.length != 2) {
		throw new SyntaxError("Wrong number of args to while");
	}
	while (evaluate(args[0], scope) !== false) {
		evaluate(args[1], scope);
	}
	// Since undefined does not exist in Egg, we return false,
	// for lack of a meaningful result.
	return false;
};

specialForms.do = (args, scope) => {
	let value = false;
	for (let arg of args) {
		value = evaluate(arg, scope);
	}
	return value;

};

specialForms.define = (args, scope) => {
	if (args.length != 2 || args[0].type != "word") {
		throw new SyntaxError("Incorrect use of define");
	}
	let value = evaluate(args[1], scope);
	scope[args[0].name] = value;
};

// set is used to update bindings defined by define
specialForms.set = (args, scope) => {
	if (args.length != 2 || args[0].type != "word") {
		throw new SyntaxError("Incorrect use of set");
	}
	let value = evaluate(args[1], scope);
	//console.log(value, 'unique');
	
	while (Object.getPrototypeOf(scope) != null) {
		//console.log(Object.prototype.hasOwnProperty.call(scope,args[0].name), 'checking scope');
		// Checking if the binding to be updated is in the current scope 
		if (Object.prototype.hasOwnProperty.call(scope,args[0].name)){
			// Updating binding with the new evaluated value
			scope[args[0].name] = value;
			break;			
		} 
		else{
			// Getting the prototype of current scope to check if binding to be updated is defined in a global scope or outer scope
			scope = Object.getPrototypeOf(scope);
			// Checking if there is another outer scope if none throw an error since we are now in the topmost scope
			if (Object.getPrototypeOf(scope) == null) throw new ReferenceError(`Binding ${args[0].name} has not been defined`);
			//console.log(scope, 'inner');
		}

	}	
	
}


specialForms.fun = (args, scope) => {
	if (!args.length) {
		throw new SyntaxError("Functions need a body");
	}
	let body = args[args.length - 1];
	let params = args.slice(0, args.length - 1).map(expr => {
		if (expr.type != "word") {
			throw new SyntaxError("Parameter names must be words");
		}
		return expr.name;
	});
	return function() {

		if (arguments.length != params.length) {
			throw new TypeError("Wrong number of arguments");
		}
		let localScope = Object.create(scope);
		for (let i = 0; i < arguments.length; i++) {
			localScope[params[i]] = arguments[i];
		}
		return evaluate(body, localScope);
	};
};


const topScope = Object.create(null);

topScope.true = true;
topScope.false = false; 

for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
	topScope[op] = Function("a, b", `return a ${op} b;`);
}

topScope.print = value => {
	console.log(value);
	return value;
};
// Adding support for arrays
topScope.array = (...values) => {	
	return values;
}
// Checks for array length
topScope.length = (array) => {
	return array.length;
}
// Gets array element when index is provided
topScope.element = (array,n) => {
	return array[n - 1];
}

function run(program) {
	return evaluate(parse(program), Object.create(topScope));
}

let u = run(` # This sums up numbers 
do(define(total, 0),
define(count, 1),
while(<(count, 11),
do(define(total, +(total, count)),
define(count, +(count, 1)))),
print(total))
`);
u;
/*run(`# yeah
	 do(# Comment here are my comments,
	# df
	#dfff
	define( plusOne, fun(a, + (a,1))),
		print(plusOne(12))
		#df
		)`); */

/*run(` # This program computes


	#for values to the power of 2
do(define(pow, fun(base, exp,
if(==(exp, 0),
1,
*(base, pow(base, -(exp, 1)))))),
print(pow(2, 6)))
`);*/

run(`do(define(b,1),
	if(<(2 ,1 ),
		set(b,2),
		set(b,5),
	),
	
	print(+(b,67)),
	)
	`)
run(`do(define(b,1),
	set(b,9),
	
	print(b),
	)
	`)

//console.log(specialForms.if([1,2],'banny'));

//let prog =  parse(`if(false,false,true)`);
//console.log(evaluate(prog, topScope));
//console.log(parse("+(a, 10)"));   
//let y = Object.create(topScope);
//let p = y.array('hi',3,5,6);
//console.log(y.element(p,3));
//console.log(y.array);
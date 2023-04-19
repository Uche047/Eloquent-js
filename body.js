/*
function talksAbout(node, string) {
			//console.log(node);
			//console.log(node.childNodes.length);

			if (node.nodeType == Node.ELEMENT_NODE) {
				for (let i = 0; i < node.childNodes.length; i++) {
					
					if (talksAbout(node.childNodes[i], string)) { 
						return true;
					}
				}
				return false;
			} 
			else if (node.nodeType == Node.TEXT_NODE) {
				console.log('Found it at node',node.nodeValue.indexOf(string) > -1, node);
				return node.nodeValue.indexOf(string) > -1;
			}
		}
console.log(talksAbout(document.body, "123"));

for (let i = 0; i< document.body.childNodes.length; i++)  {
	let inner = document.body.childNodes[i];
    console.log(inner.nodeType,Node.ELEMENT_NODE, inner);
    if (inner.childNodes != null) {
	    for (let j = 0; j < inner.childNodes.length; j++) {
	    	
	    		console.log(inner.childNodes[j].nodeType,Node.ELEMENT_NODE, inner.childNodes[j]);
	    	}
        
    }

} 
*/
//console.log(document.body.nodeType)
let link = document.body.getElementsByTagName("a")[0];
console.log(link.href);
let ostrich = document.getElementById("gertrude");
console.log(ostrich.src);
let check = document.getElementsByClassName("personal");
console.log(check[0]);
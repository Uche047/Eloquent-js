addEventListener("message", event => {
	event.u = 'hey';
	postMessage(event.u);
	postMessage(event.data * event.data);
	
});

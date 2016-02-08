//create express app
var fs = require("fs"),
	express = require('express'),
	morgan = require('morgan'),
	app = express(),
	mapViewerRepo = require('path').join(__dirname, '../workers');

//add logging middleware
app.use(morgan(':remote-addr'));
//add the middleware to serve files from specified paths
app.use(express.static(mapViewerRepo));

//listener function
app.use(function(req, res) {
	var data = "Natta";

	res.writeHead(200, {'Content-type': 'text/html'});
	res.end(data);
})
// start server and listen on port 8081
app.listen(8081, function(){
	console.log('Server running at http://127.0.0.1:8081/');
});

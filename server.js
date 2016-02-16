//create express app
var fs = require("fs"),
	express = require('express'),
	morgan = require('morgan'),
	app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	path = require('path'),
	homepage = require('./routes/routes'),
	socketController = require('./socketController'),
	connections = [];

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');
//add logging middleware
app.use(morgan('short'));
//add the middleware to serve files from specified paths
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', homepage);
app.use('/master', homepage);

var worker = io.of('/worker').on('connection', function(socket){	
	socketController.workerConnection(socket, connections);
	// socketController.broadcast(master, "workerConnection", connections);
});

var master = io.of('/master').on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("Master connected from " + address);
	// send the worker connections to the master
	socketController.broadcast(master, "workerConnection", connections);
	socket.emit('workerConnections', connections);
	io.emit("news");
})

// 404 request
function send404(response){
	response.writeHead(404, {'Content-type':'text/plain'});
	response.write("Error 404: Page note found");
	response.end();
};

// start server and listen on port 8081
http.listen(8081, function(){
	console.log('Server running at http://127.0.0.1:8081/');
});


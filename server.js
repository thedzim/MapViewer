//create express app
var fs = require("fs"),
	express = require('express'),
	morgan = require('morgan'),
	app = require('express')(),
	http = require('http').Server(app),
	io = require('socket.io')(http),
	path = require('path'),
	homepage = require('./routes/routes'),
	connections = [];

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');
//add logging middleware
app.use(morgan('short'));
//add the middleware to serve files from specified paths
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', homepage);
app.use('/master', homepage);

io.of('/worker').on('connection', function(socket){	
	var address = socket.handshake.address;
	var socketid = socket.id;
	var userObject = {
			socketid : socketid,
			address : address
		};
	console.log(userObject + " connected on /worker");
	connections.push(userObject);
	console.log(connections);
	socket.on('disconnect', function(){
    	console.log(address +': disconnected');
    	// delete the session from list of connections
    	for(var i = 0; i < connections.length; i ++){
    		if(connections[i].socketid == socket.id){
    			delete connections[i];
    		}
    	}
  	});
  	socket.on('masterConnection', function(data){
  		console.log(data);
  		socket.emit("news", "master beckons");
  	});
});

io.of('/master').on('connection', function(socket) {
	var address = socket.handshake.address;
	console.log("Master connected from " + address);
	socket.emit('workerConnections', connections);
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


// private
var self = this;
var socketio = require('socket.io')
self.connections = [];
removeConnectionFromList = function(socketid) {
	for(var i = self.connections.length - 1; i >= 0; i --){
		if(self.connections[i].socketid == socketid){
			console.log(self.connections[i].address + " disconnected");
			self.connections.splice(i, 1);
			break;
		}
    }
};

// public exports

module.exports.listen = function(app){
	io = socketio.listen(app);

	var worker = io.of('/worker').on('connection', function (socket) {
		workerConnection(socket);
		broadcast(master, "workerConnected", self.connections)
	});

	var master = io.of('/master').on('connection', function(socket) {
		masterConnection(socket);
	});

	function workerConnection(socket) {
	    // this function expects a socket connection as argument
		var address = socket.request.connection.remoteAddress;
		var socketid = socket.id;
		var userObject = {
				socketid : socketid,
				address : address
			};

		console.log("{"+ userObject.socketid + ": " + userObject.address + "} connected on /worker");
		self.connections.push(userObject);
		socket.on('disconnect', function(){
	    	removeConnectionFromList(socketid);
	    	broadcast(master, "workerConnected", self.connections);
	  	});
	  	socket.on('running', function(data){
			broadcast(master, "socketRunning", {socketid: socket.id, message: "running"});
		});
		socket.on('metrics', function(data){
			broadcast(master, "metrics", data);
		});
	};

	function masterConnection(socket) {
	    // this function expects a socket connection as argument
		var address = socket.request.connection.remoteAddress;
		var socketid = socket.id;
		var userObject = {
				socketid : socketid,
				address : address,
			};
			
		console.log("{"+ userObject.socketid + ": " + userObject.address + "} connected on /master");
		socket.on('disconnect', function(){
	    	console.log("{"+ userObject.socketid + ": " + userObject.address + "} disconnected on /master");
	  	});
	  	socket.on('masterStart', function (data) {
			broadcast(worker, "start", data);
		});
		socket.on('masterStop', function (data) {
			broadcast(worker, "stop", data);
		});
		
	};

	function masterStart(endpoint, data) {
		// start all connections
		self.connections.forEach(function(connection){
			broadcast(endpoint, "start", data);
		});
	};

 	function broadcast(endpoint, title, message) {
		endpoint.emit(title, message);
	}
	return io;
}

/**
* event list
* worker connect
* worker disconnect
* push results
*
* master start
* master stop
* master request workers
**/




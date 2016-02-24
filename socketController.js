/**
* @param {Connection} socket the connection
*/
// public exports

module.exports.workerConnection = function(socket) {
    // this function expects a socket connection as argument
    var self = this;
	var address = socket.request.connection.remoteAddress;
	var socketid = socket.id;
	var userObject = {
			socketid : socketid,
			address : address,
		};

	console.log("{"+ userObject.socketid + ": " + userObject.address + "} connected on /worker");
	self.connections.push(userObject);
	socket.on('disconnect', function(){
    	removeConnectionFromList(socketid);
  	});
	
};

module.exports.masterConnection = function(socket) {
    // this function expects a socket connection as argument
    var self = this;
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
	
};

module.exports.masterStart = function(endpoint) {
	var self = this;
	// start all connections
	console.log("master start connecitons: ");
	self.connections.forEach(function(connection){
		self.broadcast(endpoint, "start", "start");
	});
}

module.exports.broadcast = function(endpoint, title, message) {
	endpoint.emit(title, message);
}

/**
* event list
*
* worker connect
* worker disconnect
* push results
*
* master start
* master stop
* master request workers
**/


// private
var self = this;
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

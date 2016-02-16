/**
* @param {Connection} socket the connection
*/
module.exports.workerConnection = function(socket, connections) {
    // this function expects a socket connection as argument

	var address = socket.handshake.address;
	var socketid = socket.id;
	var userObject = {
			socketid : socketid,
			address : address
		};
	console.log("{"+ userObject.socketid + ": " + userObject.address + "} connected on /worker");
	connections.push(userObject);
	socket.on('disconnect', function(){
    	removeConnectionFromList(socketid, connections);
  	});
};

module.exports.broadcast = function(endpoint, title, message) {
	endpoint.emit(title, message);
}

removeConnectionFromList = function(socketid, connections) {
	for(var i = connections.length - 1; i >= 0; i --){
		if(connections[i].socketid == socketid){
			console.log(connections[i].address + " disconnected");
			connections.splice(i, 1);
			break;
		}
    }
};


var socket = io('/master');
var ipList = [];

socket.on('news', function (data) {
	console.log(data);
});
socket.on('workerConnected', function(data) {
	$.each(data, function(index, connection){
		ipList.push(connection.address);
		console.log(connection)
	});
});



$(document).ready(function(){
	$("#button").on("click", function(){
		socket.emit("masterStart", "START");
	});
})
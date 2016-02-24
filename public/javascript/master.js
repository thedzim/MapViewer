var socket = io('/master');
var masterViewModel = {
	ipList : ko.observableArray()
};


socket.on('news', function (data) {
	console.log(data);
});
socket.on('workerConnected', function(data) {
	masterViewModel.ipList(data);
});



$(document).ready(function(){
	$("#button").on("click", function(){
		socket.emit("masterStart", "START");
	});
	ko.applyBindings(masterViewModel);	
})
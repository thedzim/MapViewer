var socket = io('/master');
var masterViewModel = {
	ipList : ko.observableArray(),
	wmsURL : ko.observable("http://ows.terrestris.de/osm/service"), // default wms to grab map tiles from
	boundingBox: ko.observable()
};


socket.on('news', function (data) {
	console.log(data);
});
socket.on('workerConnected', function(data) {
	masterViewModel.ipList(data);
});
socket.on('workerDisconnected', function(date) {
	masterViewModel.ipList(data);
});
socket.on("socketRunning", function(data){
	ko.utils.arrayFirst(masterViewModel.ipList(), function(item) {
	    if(data.socketid === item.socketid){
	    	item.active = "success";
	    }
	});
});


function toggleMessage(){
	$("#masterForm").toggle();
	$("#testingMessage").toggle();
}
$(document).ready(function(){
	$("#start").on("click", function(e){
		var url = masterViewModel.wmsURL();
		var bbox = masterViewModel.boundingBox();
		socket.emit("masterStart", {url: url,  bbox: bbox});
		toggleMessage();
		e.preventDefault();
	});
	$("#stop").on("click", function(e){
		var url = masterViewModel.wmsURL();
		var bbox = masterViewModel.boundingBox();
		socket.emit("masterStart", {url: url,  bbox: bbox});
		toggleMessage();
		e.preventDefault();
	});
	ko.applyBindings(masterViewModel);	
})
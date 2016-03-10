var socket = io('/master');
var masterViewModel = new function() {
	var self = this;
	self.ipList = ko.observableArray();
	// default wms to grab map tiles from
	self.wmsURL = ko.observable("http://ows.terrestris.de/osm/service"); 
	self.boundingBox = ko.observable();
	self.bounds = ko.observable();
	self.mapVisibile = ko.observable(false);
	self.tableVisible = ko.observable(true);

	self.toggleMap = function(){
		self.mapVisibile(!self.mapVisibile());
		self.tableVisible(!self.tableVisible());
	}
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
		var bounds = masterViewModel.bounds();
		socket.emit("masterStart", {url: url,  bbox: bbox, bounds: bounds});
		toggleMessage();
		e.preventDefault();
	});
	$("#stop").on("click", function(e){
		socket.emit("masterStop", "stop");
		toggleMessage();
		masterViewModel.wmsURL();
		masterViewModel.boundingBox();
		masterViewModel.bounds();
		e.preventDefault();
	});

	mapController = MapController;
	var map = mapController.initializeMap("http://ows.terrestris.de/osm/service");
	mapController.addDrawControls(map);
	map.on('draw:created', function (e) {
		var bounds = e.layer.getBounds();
		var southWest = [bounds._southWest.lat.toFixed(3) * 1, bounds._southWest.lng.toFixed(3) * 1];
		var northEast = [bounds._northEast.lat.toFixed(3) * 1, bounds._northEast.lng.toFixed(3) * 1];
		var bbox = [bounds._southWest.lat.toFixed(3) * 1, bounds._northEast.lng.toFixed(3) * 1];

		masterViewModel.boundingBox(bbox);
		masterViewModel.bounds([southWest, northEast]);
	});

	ko.applyBindings(masterViewModel);	
})
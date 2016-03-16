var socket = io('/master');
var masterViewModel = new function() {
	var self = this;
	self.ipList = ko.observableArray();
	// default wms to grab map tiles from
	self.wmsURL = ko.observable(); 
	self.boundingBox = ko.observable();
	self.bounds = ko.observable();
	self.metrics = ko.observableArray();
	self.averageLoadTime = ko.observable();
	self.minLoadTime = ko.observable();
	self.maxLoadTime = ko.observable();
	self.numberRequests = ko.observable();

	// compute and update metrics
	self.metrics.subscribe(function(newValue){
		var sum = 0;
		ko.utils.arrayFirst(newValue, function(item){
			sum += item;
			if(self.minLoadTime() == undefined || item < self.minLoadTime()){
				self.minLoadTime(item);
			}
			if(self.maxLoadTime() == undefined || item > self.maxLoadTime()){
				self.maxLoadTime(item);
			}
		});
		var avgLoadTime = sum / newValue.length;
		self.averageLoadTime(avgLoadTime.toFixed(3) * 1);
		self.numberRequests(newValue.length);
	});
	self.wmsURL.subscribe(function(newValue){
		mapController = MapController;
		if(newValue != "http://ows.terrestris.de/osm/service"){
			layerType = 2
		}
		var map = mapController.initializeMap(newValue, 2);
		mapController.addDrawControls(map);
		map.on('draw:created', function (e) {
			var bounds = e.layer.getBounds();
			var southWest = [bounds._southWest.lat.toFixed(3) * 1, bounds._southWest.lng.toFixed(3) * 1];
			var northEast = [bounds._northEast.lat.toFixed(3) * 1, bounds._northEast.lng.toFixed(3) * 1];
			var bbox = [bounds._southWest.lat.toFixed(3) * 1, bounds._northEast.lng.toFixed(3) * 1];

			masterViewModel.boundingBox(bbox);
			masterViewModel.bounds([southWest, northEast]);
		});
	});
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
socket.on('metrics', function(data){
	if(data != null){
		masterViewModel.metrics.push(data);
	}
});


function toggleMessage(){
	$(".testingStart").toggle();
	$(".testingMessage").toggle();
}

$(document).ready(function(){
	$("#start").on("click", function(e){
		var url = masterViewModel.wmsURL();
		var bbox = masterViewModel.boundingBox();
		var bounds = masterViewModel.bounds();
		var layerType;
		if(url != "http://ows.terrestris.de/osm/service"){
			layerType = 2
		}else{
			layerType = "OSM-WMS";
		}
		socket.emit("masterStart", {url: url,  bbox: bbox, bounds: bounds, layerType: layerType});
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

	
	

	$("#tabs").tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	ko.applyBindings(masterViewModel);	
})
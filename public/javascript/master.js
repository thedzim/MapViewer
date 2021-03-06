var socket = io('/master');
var masterViewModel = new function() {
	var self = this;
	self.map = ko.observable();
	self.ipList = ko.observableArray();
	// default wms to grab map tiles from
	self.wmsURL = ko.observable();
	self.availableLayers = ko.observableArray();
	self.selectedLayers = ko.observableArray();
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

	self.bounds.subscribe(function(newValue){
		if(typeof newValue == "string"){
			var splitValues = newValue.split(",").map(Number);
			self.bounds([[ splitValues[0] , splitValues[1] ] , [ splitValues[2] , splitValues[3] ]]);
			mapController.drawBBOX(self.map, self.bounds())
		}
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

function capabilitesClickHandler(){
	var mapObject
	$("#getCapabilities").on("click", function(e){
		mapObject= mapController.initializeMap(masterViewModel.wmsURL(), masterViewModel.selectedLayers());
		masterViewModel.map = mapObject.map
		var map = masterViewModel.map;
		mapController.addDrawControls(map);
		map.on('draw:created', function (e) {
			var bounds = e.layer.getBounds();
			var southWest = [bounds._southWest.lat.toFixed(3) * 1, bounds._southWest.lng.toFixed(3) * 1];
			var northEast = [bounds._northEast.lat.toFixed(3) * 1, bounds._northEast.lng.toFixed(3) * 1];
			var bbox = [bounds._southWest.lat.toFixed(3) * 1, bounds._northEast.lng.toFixed(3) * 1];

			masterViewModel.bounds([southWest, northEast]);
		});
		$('#capabilityModal').modal('hide');
	});
}

var buttonClickHandlers = function(){
	$("#start").on("click", function(e){
		var url = masterViewModel.wmsURL();
		var bounds = masterViewModel.bounds();
		var layerType = masterViewModel.selectedLayers();
		socket.emit("masterStart", {url: url, bounds: bounds, layerType: layerType});
		toggleMessage();
		e.preventDefault();
	});

	$("#stop").on("click", function(e){
		socket.emit("masterStop", "stop");
		toggleMessage();
		masterViewModel.wmsURL();
		masterViewModel.bounds();
		e.preventDefault();
	});
	
	$("#refreshConnections").on("click", function(e){
		socket.emit("refreshConnections")
	});

}

$(document).ready(function(){
	masterViewModel.wmsURL.subscribe(function(newValue){
		mapController = MapController;
		$('#capabilityModal').modal('show') 
		mapController.getCapabilities(masterViewModel.wmsURL(), {
			success : function(data){
				masterViewModel.availableLayers(data);
				$('#capabilitiesSelect').multiSelect({
					afterSelect: function(layer){
				 		masterViewModel.selectedLayers.push(layer[0]);
					},
					afterDeselect: function(layer){
						masterViewModel.selectedLayers.remove(layer[0]);
					}
				});
				capabilitesClickHandler();
			},
			error: function(error){
				console.log(error);
			}
		});
	});
	
	$("#tabs").tabs().addClass( "ui-tabs-vertical ui-helper-clearfix" );
	buttonClickHandlers();
	ko.applyBindings(masterViewModel);	
})
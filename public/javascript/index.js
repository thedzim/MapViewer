
var socket = io('/worker');
var map;
var tileLayer

socket.on('start', function(data){
    var mapObjects;
    if(map == undefined){
         mapObjects = MapController.initializeMap(data.url, data.layerType);
         map = mapObjects.map
         tileLayer = mapObjects.tileLayer
    }
    $("#map").show();
	toggleMessage();
	setTimeout(function(){
		$("#testingGIF").hide()
	}, 3000);
    if(data.bounds){
       MapController.drawBBOX(map, data.bounds);
    }

    tileLayer.on("load", function(){
        setTimeout(MapController.operateMap, 4000, map, data.bounds, MapController);
    });
    
	MapController.operateMap(map, data.bounds, MapController);
    socket.emit("running", "running");
});
socket.on("stop", function(data){
    $("#map").hide();
    tileLayer.removeEventListener("load", autoviewer);
    socket.emit("stopped", "stopped");
    toggleMessage();
});

function toggleMessage() {
    $("#waitingMessage").toggle();
    $("#testingMessage").toggle();
    MapController.stopped = !MapController.stopped;
}
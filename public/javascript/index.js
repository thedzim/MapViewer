
var socket = io('/worker');
var map;

socket.on('start', function(data){
    if(map == undefined){
         map = MapController.initializeMap(data.url, data.layerType);
    }
    $("#map").show();
	toggleMessage();
	setTimeout(function(){
		$("#testingGIF").hide()
	}, 3000);
    if(data.bounds){
       MapController.drawBBOX(map, data.bounds);
    }
	MapController.operateMap(map, data.bounds);
    socket.emit("running", "running");
});
socket.on("stop", function(data){
    clearInterval(autoViewer);
    $("#map").hide();
    socket.emit("stopped", "stopped");
    toggleMessage();
});

function toggleMessage() {
    $("#waitingMessage").toggle();
    $("#testingMessage").toggle();
}
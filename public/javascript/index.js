
var socket = io('/worker');
var autoViewer;
var map;

socket.on('start', function(data){
    map = MapController.initializeMap(data);
    $("#map").show();
	toggleMessage();
	setTimeout(function(){
		$("#testingGIF").hide()
	}, 3000);
	MapController.operateMap(map);
    socket.emit("running", "running");
});
socket.on("stop", function(data){
    clearInterval(autoViewer);
    map.remove();
    $("#map").hide();
    socket.emit("stopped", "stopped");
    toggleMessage();
});

function toggleMessage() {
    $("#waitingMessage").toggle();
    $("#testingMessage").toggle();
}



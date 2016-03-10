
var socket = io('/worker');
var autoViewer;
var map;

socket.on('start', function(data){
    map = MapController.initializeMap(data.url);
    $("#map").show();
	toggleMessage();
	setTimeout(function(){
		$("#testingGIF").hide()
	}, 3000);
    console.log(data);
    if(data.bounds){
       MapController.drawBBOX(map, data.bounds);       
    }
	MapController.operateMap(map, data.bounds);
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



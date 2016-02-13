var $ = jQuery;

$(document).ready(function(){
    var socket = io('/master')
    socket.emit('masterConnection', "master connected");
    socket.on('workerConnections', function(data) {
        console.log(data);
    });
    socket.on('news', function(data){
    	console.log(data);
    });
});
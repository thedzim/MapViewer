var $ = jQuery;

$(document).ready(function(){
    var socket = io()
    socket.emit('masterConnection', "master connected");
});
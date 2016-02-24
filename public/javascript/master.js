var socket = io('/master');
  socket.on('news', function (data) {
    console.log(data);
  });


$(document).ready(function(){
	$("#button").on("click", function(){
		socket.emit("masterStart", "START");
	});
})
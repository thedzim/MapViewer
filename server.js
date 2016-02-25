//create app
var app = require('http').createServer(handler);
var static = require('node-static');
var file = new(static.Server)();
// socket
var io = require('socket.io')(app);
// file system
var fs = require('fs');
// path
var path = require('path');

// socket controller
var socketController = require('./socketController');

// listen to port 8081
app.listen(8081, function(){
	console.log('Server running at http://127.0.0.1:8081/');
});

// request handler
function handler (req, res) {
	// file.serve(req, res)
	var requestedPath = '/public/';
	var urlPath = path.parse(req.url);
	var contentType = '';
	switch(urlPath.dir){
		case '/':
			switch(urlPath.base){
				case 'master': 
					requestedPath += 'views/master.html'
					contentType = "text/html"
					break;
				case 'favicon.ico' :
					requestedPath += urlPath.base
					break;
				case '' :
					requestedPath += 'views/index.html'
					contentType = "text/html"
					break;
				default:
					requestedPath += 'views/' + urlPath.base +'.html'
					contentType = "text/html"
			}
			break;
		case "/libs" : 
			requestedPath += 'libs/' + urlPath.base
			contentType = "application/javascript"
			break;
		case '/javascript' : 
			requestedPath += 'javascript/' + urlPath.base
			contentType = "application/javascript"
			break;
		case '/css' : 
			requestedPath += 'css/' + urlPath.base
			contentType = "text/css"
			break;
		default:
			requestedPath += 'views/index.html';
	}
	
	fs.readFile(__dirname + requestedPath,
	function (err, data) {
		if (err) {
  			res.writeHead(500);
  			return res.end('Internal Server Error. Cannot process request.');
		}
		res.writeHead(200, {"Content-length" : data.length, "content-type" : contentType});
		res.end(data);
		return;
	});
}

var worker = io.of('/worker').on('connection', function (socket) {
	socketController.workerConnection(socket);
	socketController.broadcast(master, "workerConnected", socketController.connections)
	socket.on('running', function(data){
		socketController.broadcast(master, "socketRunning", {socketid: socket.id, message: "running"});
	});
});


var master = io.of('/master').on('connection', function(socket) {
	socketController.masterConnection(socket);
	socket.on('masterStart', function (data) {
		socketController.masterStart(worker, data);
	});
});




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
	switch(urlPath.dir){
		case '/':
			switch(urlPath.base.length){
				case 0: 
					requestedPath += 'views/index.html'
					break;
				default:
					requestedPath += 'views/' + urlPath.base +'.html'
			}
			break;
		case "/libs" : 
			requestedPath += 'libs/' + urlPath.base
			break;
		case '/javascript' : 
			requestedPath += 'javascript/' + urlPath.base
			break;
		case '/css' : 
			requestedPath += 'css/' + urlPath.base
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
		res.writeHead(200);
		res.end(data);
		return;
	});
}

var worker = io.of('/worker').on('connection', function (socket) {
	socketController.workerConnection(socket);
	socketController.broadcast(master, "workerConnected", socketController.connections)
});


var master = io.of('/master').on('connection', function(socket) {
	socketController.masterConnection(socket);
	socket.on('masterStart', function (data) {
		socketController.masterStart(worker);
	});
});




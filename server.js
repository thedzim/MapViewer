//create express app
var fs = require("fs"),
	express = require('express'),
	morgan = require('morgan'),
	app = express(),
	path = require('path'),
	homepage = require('./routes/index')

app.set('views', __dirname + '/public/views');
app.set('view engine', 'jade');
//add logging middleware
app.use(morgan('combined'));
//add the middleware to serve files from specified paths
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', homepage);

// 404 request
function send404(response){
	response.writeHead(404, {'Content-type':'text/plain'});
	response.write("Error 404: Page note found");
	response.end();
};

//listener function
// app.use(function(req, res) {
// 	if(req.method == 'GET' && req.url == '/'){
// 		res.writeHead(200, {'Content-type': 'text/html'});
// 		// fs.createReadStream('./index.html').pipe(res);
// 	}else{
// 		send404(res);
// 	}
// });
// start server and listen on port 8081
app.listen(8081, function(){
	console.log('Server running at http://127.0.0.1:8081/');
});

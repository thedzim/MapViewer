var express = require('express');
var router = express.Router();

module.exports{
	router.get('/', function(req, res, next) {
		res.render('index');
	});	
}
var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('index');
});	

router.get('/master', function(req, res, next) {
	res.render('master');
});


module.exports = router;
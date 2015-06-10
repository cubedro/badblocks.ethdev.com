'use strict'

// Load utilities
var config = require('./lib/utils/config');
var util = require('util');
var _ = require('lodash');
var validator = require('./lib/validator');

// Init the db
var mongoose = require('mongoose');
mongoose.connect(config.db_uri, config.db_options, function (err, res)
{
	if (err) {
		console.error('ERROR connecting to:', config.db_uri, err);
	} else {
		console.log('Connected to:', config.db_uri);
	}
});
var Report = require('./lib/model')(mongoose);


// Init http server
var express = require('express');
var app = express();
var jsonrpc = require('node-express-json-rpc2');


// App setup
app.set('port', process.env.PORT || 3005);

if( process.env.NODE_ENV !== 'production')
{
	var path = require('path');
	var bodyParser = require('body-parser');
	var errorHandler = require('errorhandler');
	var morgan = require('morgan');

	app.use(morgan('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(express.static(path.join(__dirname, 'dist')));
	app.use(errorHandler());
}

app.use(jsonrpc());

// app.get('/', function (req, res) {
// 	res.render('index');
// });

app.post('/', function (req, res)
{
	res.rpc('eth_badBlock', function (params, respond)
	{
		var result = validator(params, req.ip);

		var r = new Report(result);

		r.save(function (err)
		{
			if (err) {
				console.error(err);
				respond(jsonrpc.INVALID_PARAMS);
			}
			else {
				console.log(result);
				respond('ok');
			}
		});
	});
});

var server = require('http').createServer(app);

server.listen(app.get('port'), function(){
	console.log('Server started on port', app.get('port'));
});

module.exports = server;

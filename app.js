'use strict'

// Load utilities
var _ = require('lodash');
var config = require('./lib/utils/config');
var formatter = require('./lib/formatter');

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
var http = require('http');
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
	// app.use(bodyParser.json());
	// app.use(bodyParser.urlencoded({ extended: false }));
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
		var result = formatter(params, req.ip);

		var r = new Report(result);

		var err = r.validateSync();

		if( err )
		{
			console.error(err);
			respond(jsonrpc.INVALID_PARAMS);
		}
		else {
			r.save();
			console.info(result);
			respond({error: null, result: 'ok'});
		}
	});
});

var server = http.createServer(app);

server.listen(app.get('port'), function(){
	console.log('Server started on port', app.get('port'));
});

var gracefulShutdown = function() {
	console.log('');
    console.error("xxx", "sys", "Received kill signal, shutting down gracefully.");

    mongoose.disconnect();

    process.exit(0);
}

// listen for TERM signal .e.g. kill
process.on('SIGTERM', gracefulShutdown);

// listen for INT signal e.g. Ctrl-C
process.on('SIGINT', gracefulShutdown);

module.exports = server;

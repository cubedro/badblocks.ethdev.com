'use strict'

var _ = require('lodash');

// Init http server
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var jsonrpc = require('node-express-json-rpc2');
var morgan = require('morgan');
var util = require('util');

var validator = require('./lib/validator');

// App setup
app.set('port', process.env.PORT || 3005);
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(jsonrpc());
app.use(express.static(path.join(__dirname, 'dist')));



if( process.env.NODE_ENV === 'development')
{
	app.use(errorHandler());
}

app.get('/', function (req, res) {
	res.render('index');
});

app.post('/', function (req, res)
{
	res.rpc('eth_badBlock', function (params, respond)
	{
		validator(params, function(err, ok)
		{
			if(err !== null)
			{
				respond(err);
			}
			else
			{
				respond({result: ok});
			}
		});
	});
});

var server = require('http').createServer(app);

server.listen(app.get('port'), function(){
	console.log('Server started on port', app.get('port'));
});

module.exports = server;

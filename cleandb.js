'use strict'

// Load utilities
var config = require('./lib/utils/config');

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

Report.remove();

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

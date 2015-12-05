'use strict';

  //==============================//
 //           SET UP             //
//==============================//
/*
 * require() can make a cache for a dependency so it is not reloaded when other modules require it.
 * Anyway, the variable for the dependency and other variables are set in the global namespace for simplicity.
 */
var path = global.path = require('path');
var fs = require('fs');
var express = global.express = require('express');

var clientDir = path.join(__dirname, '../client');
var CONFIG = global.CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

var app = global.app = express();

/**
 * Load all providers in CONFIG["providers"].
 * There must be: authentication, data and security providers.
 */
var providers = global.providers = {};
Object.keys(CONFIG["providers"]).forEach(function (key) {
	providers[key] = require('./providers/' + CONFIG["providers"][key] + '_' + key + '-provider');
});

  //==============================//
 //            ROUTES            //
//==============================//
/** Middleware for parsing json requests' bodies */
app.use(require('body-parser').json());
/** Middleware for retrieving client static files */
app.use(express.static(clientDir));
/** Router for accessing the server api */
app.use('/api', require('./api/routes'));
/**
 * A final middleware that matches any other unhandled route, with the entry point of the client app,
 * required in order to keep the client and server applications independent from each other,
 * without the server application having any knowledge of the routes of the client application.
 */
app.use(/^([^.]+)$/, function (req, res) {
	res.sendFile(path.join(clientDir, '/index.html'));
});
/*
 * Express default error handler is added automatically at the end of the middleware stack.
 * Set NODE_ENV=production to avoid sending the error stack trace to the client,
 * since the client shouldn't receive details of server errors.
 */


  //==============================//
 //           RUNNING            //
//==============================//
var port = process.env[CONFIG["server"]["env-port"]] || CONFIG["server"]["alt-port"];
if (!!port) {
	app.listen(port, process.env[CONFIG["server"]["env-host"]], function () {
		console.log('Server is running on port ' + port);
	});
}
else  {
	console.log('Not defined port to start the server');
}


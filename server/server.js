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

var providers = global.providers = {
	authentication: require('./providers/' + CONFIG["providers"]["authentication"] + '_authentication-provider'),
	database: require('./providers/' + CONFIG["providers"]["database"] + '_database-provider')
};

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
app.use(/[\s\S]*/, function (req, res) {
	res.sendFile(path.join(clientDir, '/index.html'));
});

  //==============================//
 //           RUNNING            //
//==============================//
var port = process.env.PORT || CONFIG["server"]["port"];
app.listen(port, function () {
	console.log("Server is running on port " + port);
});

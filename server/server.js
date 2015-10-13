'use strict';

// SET UP

var path = require('path');
var clientDir = path.join(__dirname, '../client');

var fs = require('fs');
global.CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
// requiring 'express' in each module doesn't reload the module since <require()> creates a cache.
// variable <express> is created as global only for avoiding repeating the variable declaration in each module.
global.express = require('express');
global.app = express();

global.providers = {
	authentication: require('./providers/authentication-provider'),
	database: require('./providers/database-provider')
};

// ROUTES

app.use(require('body-parser').json());

app.use(express.static(clientDir));

app.use('/api', require('./api/routes'));

// a final middleware with the entry point of the client app is required
// this is in order to keep the client and server application independent,
// without the server application having knowledge of the routes of the client application.
app.use(/[\s\S]*/, function (req, res) {
	res.sendFile(path.join(clientDir, '/index.html'));
});


// RUNNING

var port = process.env.PORT || CONFIG["server"]["port"];
app.listen(port, function () {
	console.log("Server is running on port " + port);
});

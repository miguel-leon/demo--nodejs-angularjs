'use strict';

var path = require('path');
var fs = require('fs');
var CONFIG = global.CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

var options = CONFIG["database"]["options"] || {};
options.dialectOptions = {
	multipleStatements: true
};

var Sequelize = global.Sequelize = require('sequelize');
var sequelize = global.sequelize = require('./connection')(Sequelize, options);

//sequelize.validate().then(function(errors) { console.log('errors: ' + errors) });

var models = require('./models');

var initialDataQuery = fs.readFileSync(path.join(__dirname, 'scripts/data.sql'), 'utf8');

sequelize.sync({force: true}).then(
	function () {
		sequelize.query(initialDataQuery, {raw: true});
	}
);

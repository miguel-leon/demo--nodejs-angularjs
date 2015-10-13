'use strict';

var path = require('path');
var fs = require('fs');
var CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));


var Sequelize = global.Sequelize = require("sequelize");

var OPTIONS = CONFIG["database"]["options"];
OPTIONS.dialectOptions = {
	multipleStatements: true
};

var sequelize = global.sequelize = new Sequelize(CONFIG["database"]["name"],
	CONFIG["database"]["username"], CONFIG["database"]["password"], OPTIONS);

//sequelize.validate().then(function(errors) { console.log('errors: ' + errors) });

var models = require('./models');

var initialDataQuery = fs.readFileSync(path.join(__dirname, 'scripts/data.sql'), 'utf8');

sequelize.sync({force: true}).then(
	function () {
		sequelize.query(initialDataQuery, {raw: true});
	}
);

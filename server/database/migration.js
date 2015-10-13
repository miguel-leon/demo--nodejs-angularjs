'use strict';

var path = require('path');
var fs = require('fs');
var CONFIG = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));


var Sequelize = global.Sequelize = require("sequelize");

var sequelize = global.sequelize = new Sequelize(CONFIG["database"]["name"],
	CONFIG["database"]["username"], CONFIG["database"]["password"],
	CONFIG["database"]["options"]);

//sequelize.validate().then(function(errors) { console.log('errors: ' + errors) });

var models = require('./models');

sequelize.sync({force: true});


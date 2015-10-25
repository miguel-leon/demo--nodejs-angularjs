'use strict';

// following variables must be set in the global scope at this point.
// var CONFIG;

module.exports = function (Sequelize, options) {
	options = options || {};
	var dbname = CONFIG["database"]["name"];

	var url = process.env[CONFIG["database"]["env-url"]] || CONFIG["database"]["alt-url"];
	if (!url) return new Sequelize(dbname, CONFIG["database"]["username"], CONFIG["database"]["password"], options);

	return new Sequelize(url+dbname, options);
};


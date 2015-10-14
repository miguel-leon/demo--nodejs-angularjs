'use strict';

// following variables must be set in the global scope at this point.
// var CONFIG;
// var api_errors;

var Sequelize = global.Sequelize = require("sequelize");
var sequelize = global.sequelize = new Sequelize(CONFIG["database"]["name"],
	CONFIG["database"]["username"], CONFIG["database"]["password"],
	CONFIG["database"]["options"]);

var models = require('../database/models');

/**
 * @implements DatabaseProvider
 * Using Sequelize ORM
 */
module.exports = {
	/** @implements DatabaseProvider~User */
	Users: {
		list: function (limit, start) {
			return models.User.findAll({limit: limit, offset: start});
		},

		find: function (fields) {
			if (!fields.id) return models.User.findOne({where: fields}).then(nonexistentIfNull);
			return models.User.findById(fields.id).then(nonexistentIfNull);
		},

		create: function (user) {
			return models.User.create(user)
			.then(null, // success handler managed elsewhere
				function (reason) {
					if (reason instanceof Sequelize.UniqueConstraintError) throw api_errors.DuplicatedUserError;
					if (reason instanceof Sequelize.ValidationError) throw api_errors.MissingDataError;
					// Sequelize.ForeignKeyConstraintError may happen if client was hacked.
					throw reason;
				});
		},

		update: function (user) {
			var options = {
				where: {id: user.id}
			};
			return models.User.update(user, options)
			.then(function (data) {
					if (!data[0] /* affected rows count */) throw api_errors.NonexistentUserError;
					return user; // MySql doesn't return the updated rows
				},
				function (reason) {
					if (reason instanceof Sequelize.UniqueConstraintError) throw api_errors.DuplicatedUserError;
					// Sequelize.ForeignKeyConstraintError may happen if client was hacked.
					throw reason;
				});
		},

		delete: function (fields) {
			return models.User.destroy({where: fields})
			.then(function (count) {
					if (!count) throw api_errors.NonexistentUserError;
					return fields;
				});
		},

		/* NOT USED */
		findAll: function (fields) {},
		save: function (user) {}
	},
	/** @implements DatabaseProvider~Profile */
	Profiles: {
		list: function () {
			return models.Profile.findAll();
		},

		/* NOT USED */
		find: function (id) {}
	},
	/** @implements DatabaseProvider~Holding */
	Holdings: {
		list: function () {
			return models.Holding.findAll();
		},

		/* NOT USED */
		find: function (id) {}
	}
};

  //==============================//
 //      HOISTED FUNCTIONS       //
//==============================//
function nonexistentIfNull(user) {
	if (!user) throw api_errors.NonexistentUserError;
	return user;
}
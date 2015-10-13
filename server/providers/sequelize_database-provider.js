'use strict';

// following variables must be set in the global scope at this point.
// var CONFIG;

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
			if (!fields.id) {
				var where = {};
				models.User.attributes.forEach(function (attr) {
					if (!!fields[attr]) where[attr] = fields[attr];
				});
				return models.User.findOne({where: where});
			}
			return models.User.findById(fields.id);
		},
		create: function (user) {
			return models.User.create(user).then(
				null,
				function (reason) {
					console.log(reason);
					return reason;
				}
			);
		},
		update: function (user) {
			return models.User.update(user).then(
				null,
				function (reason) {
					console.log(reason);
					return reason;
				}
			);
		},

		/**
		 * If <user.id> is not set, creates a new record in the database.
		 * Otherwise updates the corresponding record if it exits.
		 * @param {User} user
		 * @returns {Promise.<User>} resolves with @arg user if the user was saved; null otherwise (nonexistent user).
		 * @throws {Error}
		 * @typedef Error
		 * @property {boolean} missingData
		 * @property {boolean} duplicatedUser
		 */
		save: function (user) {},

		/**
		 * Delete User records that match the properties in <fields>
		 * @param {Object} fields
		 * @returns {Promise.<User>} resolves with @arg user if the user was deleted; null otherwise (nonexistent user).
		 */
		delete: function (fields) {},

		/* NOT USED */
		findAll: function (fields) {}
	},
	/**
	 * Data Access Object for Profiles
	 */
	Profiles: {
		/**
		 * List all profiles
		 * @param limit [optional]
		 * @param start [optional]
		 * @returns {Promise.<Profile[]>}
		 */
		list: function (limit, start) {},

		/**
		 * Return the profile that matches the properties in <fields>
		 * @param {Object} fields
		 * @returns {Promise.<Profile>} resolves with @arg profile if corresponding record exits; null otherwise.
		 */
		find: function (fields) {}
	},
	/**
	 * Data Access Object for Holdings
	 */
	Holdings: {
		/**
		 * List all holdings
		 * @param limit [optional]
		 * @param start [optional]
		 * @returns {Promise.<Holding[]>}
		 */
		list: function (limit, start) {},

		/**
		 * Return the holding that matches the properties in <fields>
		 * @param {Object} fields
		 * @returns {Promise.<Holding>} resolves with @arg holding if corresponding record exits; null otherwise.
		 */
		find: function (fields) {}
	}
};

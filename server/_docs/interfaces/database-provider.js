/**
 * In order for Database Providers to be swappable, they need to implement the following interface.
 * Use a pattern similar to a Data Access Object.
 * Put implementing objects in path: server/providers/
 * Name implementing objects with filename: XXXXX_database-provider.js
 * @interface DatabaseProvider
 */
module.exports = {
	/**
	 * @typedef UserError
	 * @property user = null
	 */
	/**
	 * @typedef {UserError} MissingDataError
	 * @property missingData = true
	 */
	/**
	 * @typedef {UserError} DuplicatedUserError
	 * @property duplicatedUser = true
	 */
	/**
	 * @typedef {UserError} NonexistentUserError
	 * @property nonexistentUser = true
	 */

	/**
	 * Data Access Object for Users
	 * @interface DatabaseProvider~User
	 */
	Users: {
		/**
		 * List all users.
		 * @param {int} limit [Optional] maximum number of results
		 * @param {int} start [Optional] result offset start
		 * @returns {Promise.<User[]>}
		 * @throws
		 */
		list: function (limit, start) {},
		/**
		 * Return the user that matches the properties in <fields>.
		 * @param {Object} fields
		 * @returns {Promise.<User, UserError>} resolves with
		 * @arg {User} user if corresponding record exits.
		 * @throws {NonexistentUserError} reason
		 */
		find: function (fields) {},
		/**
		 * Creates a new record in the database.
		 * @param {User} user
		 * @returns {Promise.<User, UserError>} resolves with
		 * @arg {User} user if the user was created.
		 * @throws {MissingDataError} reason
		 * @throws {DuplicatedUserError} reason
		 * @throws
		 */
		create: function (user) {},
		/**
		 * Modifies an existing record in the database.
		 * @param {User} user
		 * @returns {Promise.<User, UserError>} resolves with
		 * @arg {User} user if the user was updated.
		 * @throws {DuplicatedUserError} reason
		 * @throws {NonexistentUserError} reason
		 * @throws
		 */
		update: function (user) {},
		/**
		 * Delete User records that match the properties in <fields>.
		 * @param {Object} fields
		 * @returns {Promise.<User, UserError>} resolves with
		 * @arg {User} user if the user was deleted.
		 * @throws {NonexistentUserError} reason
		 * @throws
		 */
		delete: function (fields) {},


		/* NOT USED */

		/**
		 * List users that match  the properties in <fields>.
		 */
		findAll: function (fields) {},
		/**
		 * If <user.id> is not set, creates a new record in the database (method create).
		 * Otherwise updates the corresponding record if it exits (method update).
		 */
		save: function (user) {}
	},
	/**
	 * Data Access Object for Profiles
	 * @interface DatabaseProvider~Profile
	 */
	Profiles: {
		/**
		 * List all profiles
		 * @returns {Promise.<Profile[]>}
		 * @throws
		 */
		list: function () {},

		/* NOT USED */
		find: function (id) {}
	},
	/**
	 * Data Access Object for Holdings
	 * @interface DatabaseProvider~Holding
	 */
	Holdings: {
		/**
		 * List all holdings
		 * @returns {Promise.<Holding[]>}
		 * @throws
		 */
		list: function () {},

		/* NOT USED */
		find: function (id) {}
	}
};

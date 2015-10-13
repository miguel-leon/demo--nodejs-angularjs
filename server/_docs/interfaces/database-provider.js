/**
 * In order for Database Providers to be swappable, they need to implement the following interface.
 * Use a pattern similar to a Data Access Object.
 * Put implementing objects in path: server/providers/
 * Name implementing objects with filename: XXXXX_database-provider.js
 * @interface DatabaseProvider
 */
module.exports = {
	/**
	 * Data Access Object for Users
	 * @interface DatabaseProvider~User
	 */
	Users: {
		/**
		 * List all users
		 * @param limit [Optional] maximum number of results
		 * @param start [Optional] result offset start
		 * @returns {Promise.<User[]>}
		 * @throws
		 */
		list: function (limit, start) {},
		/**
		 * Return the user that matches the properties in <fields>
		 * @param {Object} fields
		 * @returns {Promise.<User>} resolves with @arg user if corresponding record exits; null otherwise.
		 * @throws
		 */
		find: function (fields) {},
		/**
		 * Creates a new record in the database.
		 * @param {User} user
		 * @returns {Promise.<User, Error>} resolves with @arg user if the user was created; null otherwise.
		 * @throws {Error} reason
		 * @typedef Error
		 * @property {boolean} missingData
		 * @property {boolean} duplicatedUser
		 * @throws
		 */
		create: function (user) {},
		/**
		 * Modifies an existing record in the database.
		 * @param {User} user
		 * @returns {Promise.<User, Error>} resolves with @arg user if the user was updated; null otherwise.
		 * @throws {Error} reason
		 * @typedef Error
		 * @property {boolean} missingData
		 * @property {boolean} duplicatedUser
		 * @property {boolean} nonexistentUser
		 * @property {boolean} invalidPassword
		 * @throws
		 */
		update: function (user) {},
		/**
		 * Delete User records that match the properties in <fields>
		 * @param {Object} fields
		 * @returns {Promise.<User>} resolves with @arg user if the user was deleted; null otherwise (nonexistent user).
		 * @throws
		 */
		delete: function (fields) {},


		/* NOT USED */

		/**
		 * List users that match  the properties in <fields>
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

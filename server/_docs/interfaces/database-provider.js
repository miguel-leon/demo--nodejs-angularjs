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
		 * @param limit [optional]
		 * @param start [optional]
		 * @returns {Promise.<User[]>}
		 */
		list: function (limit, start) {},

		/**
		 * Return the user that matches the properties in <fields>
		 * @param {Object} fields
		 * @returns {Promise.<User>} resolves with @arg user if corresponding record exits; null otherwise.
		 */
		find: function (fields) {},

		/**
		 * If <user.id> is not set, creates a new record in the database.
		 * Otherwise updates the corresponding record if it exits.
		 * @param {User} user
		 * @returns {Promise.<User, Error>} resolves with @arg user if the user was saved; null otherwise (nonexistent user).
		 * @throws {Error} reason
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
		findAll: function (fields) {},
		create: function (user) {},
		update: function (user) {}
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

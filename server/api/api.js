'use strict';

// following variables must be set in the global scope at this point.
// var providers;
var api_errors = global.api_errors = require('./api-errors');

/**
 * module.exports middlewares for server api.
 * The middlewares use the argument <next> as an error handler for unhandled/unknown internal errors
 * passed in a promise. Calling next(error) should look for the next error handler middleware.
 * In case there is none, it defaults to the in-built error handler added by express.
 */
module.exports = {
	/**
	 * Middleware for retrieving the list of users.
	 */
	getUserList: function (req, res, next) {
		providers.database.Users.list(req.headers.limit, req.headers.start).then(
			successHandlerFor('users', res,
				function (users) {
					users.forEach(stripPasswordFromUserResponse);
				}),
			next
		);
	},
	/**
	 * Middleware for retrieving a single user data.
	 */
	getUser: function (req, res, next) {
		providers.database.Users.find({id: req.params.id}).then(
			function (user) {
				if (!user) rejectClient(res, api_errors.NonexistentUserError);
				else successHandlerFor('user', res)(stripPasswordFromUserResponse(user));
			},
			next
		);
	},
	/**
	 * Middleware for creating new user.
	 */
	createUser: function (req, res, next) {
		delete req.body.id; // in case of client hacked
		if (!req.body.password) return rejectClient(res, api_errors.MissingDataError);
		providers.security.hash(req.body.password).then(
			function (hash) {
				req.body.password = hash;
				return providers.database.Users.create(req.body);
			}
		).then(
			successHandlerFor('user', res, stripPasswordFromUserResponse),
			rejectionIdentifierHandler(res, next)
		);
	},
	/**
	 * Middleware for modifying an existing user.
	 */
	updateUser: function (req, res, next) {
		if (!req.body.id) return rejectClient(res, api_errors.MissingDataError); // client hacked
		if (!req.body.password) { // if it didn't require a change of password
			providers.database.Users.update(req.body).then( // update the user right away
				successHandlerFor('user', res, stripPasswordFromUserResponse),
				rejectionIdentifierHandler(res, next)
			);
		}
		else { // else, if required to change password
			// check if the current password was sent
			if (!req.body.previous_password) rejectClient(res, api_errors.InvalidPasswordError);
			// then find the user
			else providers.database.Users.find({id: req.body.id}).then(
				function (user) {
					if (!user) throw api_errors.NonexistentUserError;
					// and verify that the passwords match
					return providers.security.compare(req.body.previous_password, user.password);
				}
			).then(
				function (same) {
					delete req.body.previous_password;
					// if the passwords match
					if (same) return providers.security.hash(req.body.password); // hash new password
					throw api_errors.InvalidPasswordError;
				}
			).then(
				function (hash) {
					req.body.password = hash;
					return providers.database.Users.update(req.body); // then finally update the user
				}
			).then(
				successHandlerFor('user', res, stripPasswordFromUserResponse),
				rejectionIdentifierHandler(res, next)
			);
		}
	},
	/**
	 * Middleware for deleting an existing user in database. Must be other than the authenticated user.
	 */
	deleteUser: function (req, res, next) {
		if (req.params.id == req.decoded.id) return rejectClient(res, api_errors.UnableToDeleteError);
		providers.database.Users.delete({id: req.params.id}).then(
			successHandlerFor('users', res),
			rejectionIdentifierHandler(res, next)
		);
	},

	/**
	 * Middleware for retrieving the list of profiles.
	 */
	getProfiles: function (req, res, next) {
		providers.database.Profiles.list().then(
			successHandlerFor('profiles', res),
			next
		)
	},
	/**
	 * Middleware for retrieving the list of holdings.
	 */
	getHoldings: function (req, res, next) {
		providers.database.Holdings.list().then(
			successHandlerFor('holdings', res),
			next
		)
	}
};

  //==============================//
 //      HOISTED FUNCTIONS       //
//==============================//
/**
 * @param {String} key
 * @param res - Response object
 * @param {Function} filter [Optional] function to pass in the value before sending it to the client
 * @returns {Function} that handles resolved promises from a provider.
 * @arg value set to the JSON response under the key <key>
 */
function successHandlerFor(key, res, filter) {
	return function (value) {
		if (!!filter) filter(value);
		var json = {success: true};
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		json[key] = value;
		res.json(json);
	}
}
/**
 * Sends a known rejection from a provider to the client.
 * @param res - Response object
 * @param reason should have been curated by the provider and stripped off of any information
 * intended only for the server application.
 */
function rejectClient(res, reason) {
	reason.success = false;
	res.json(reason);
}
/**
 * @param res
 * @returns {Function} handler that identifies if a rejection is known and send the appropriate status
 * back to the client
 */
function rejectionIdentifierHandler(res, next) {
	return function (reason) {
		if (api_errors.isKnown(reason)) rejectClient(res, reason);
		else next(reason); // unknown reason
	}
}
/**
 * Removes the password attribute from the User object to be responded.
 * @param {User} user
 */
function stripPasswordFromUserResponse(user) {
	user.password = undefined;
	return user;
}
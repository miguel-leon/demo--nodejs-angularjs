'use strict';

var Promise = require('promise');

// following variables must be set in the global scope at this point.
// var providers;
var api_errors = global.api_errors = require('./api-errors');

/**
 * module.exports middlewares for server api.
 * The middlewares use the argument <next> as an error handler for unhandled/unknown internal errors
 * passed down in promises. Calling next(error) should look for the next error handler middleware.
 * In case there is none, it defaults to the in-built error handler added by express.
 */
module.exports = {
	/**
	 * Middleware for retrieving the list of users.
	 */
	getUserList: function (req, res, next) {
		providers.database.Users.list(req.headers.limit, req.headers.start)
		.then(function (users) {
				users.forEach(stripPasswordFromUserResponse);
				return users;
			})
		.then(makeSuccessJSONResponseFor('users'))
		.then(res.json.bind(res), next);
	},
	/**
	 * Middleware for retrieving a single user data.
	 */
	getUser: function (req, res, next) {
		providers.database.Users.find({id: req.params.id})
		.then(stripPasswordFromUserResponse)
		.then(makeSuccessJSONResponseForUser, rejectionHandler)
		.then(res.json.bind(res), next);
	},
	/**
	 * Middleware for creating new user.
	 */
	createUser: function (req, res, next) {
		delete req.body.id; // in case of client hacked
		if (!req.body.password) return res.json(addFailureToResponse(api_errors.MissingDataError));
		providers.security.hash(req.body.password)
		.then(function (hash) {
				req.body.password = hash;
				return providers.database.Users.create(req.body);
			})
		.then(stripPasswordFromUserResponse)
		.then(makeSuccessJSONResponseForUser, rejectionHandler)
		.then(res.json.bind(res), next);
	},
	/**
	 * Middleware for modifying an existing user.
	 */
	updateUser: function (req, res, next) {
		if (!req.body.id) return res.json(addFailureToResponse(api_errors.MissingDataError)); // client hacked

		(new Promise(function (resolve, reject){
			// if it didn't require a change of password
			if (!req.body.password) {
				resolve(req.body); // resolve to update user right away
			}
			else { // else, if required to change password
				// check if the current password was sent
				if (!req.body.previous_password)
					return reject(api_errors.InvalidPasswordError);
				// then find the user
				providers.database.Users.find({id: req.body.id})
				.then(function (user) {
					// and verify that the passwords match
					return providers.security.compare(req.body.previous_password, user.password);
				})
				.then(function (same) {
					if (same) { // if the passwords match
						delete req.body.previous_password;
						return providers.security.hash(req.body.password); // hash new password
					}
					throw api_errors.InvalidPasswordError;
				})
				.then(function (hash) {
					req.body.password = hash;
					return req.body; // then finally resolve to update the user
				})
				.then(resolve, reject);
			}
		}))
		.then(function updateUser(user) { // update user
				return providers.database.Users.update(user);
			})
		.then(stripPasswordFromUserResponse)
		.then(makeSuccessJSONResponseForUser, rejectionHandler)
		.then(function checkIfUpdatedLoggedUser(json) { // check if updated logged user
				if (providers.authentication.isAuthenticated(json.user.id, req, res))
					return providers.authentication.allow(json, req, res); // regenerate authentication
				return json;
			})
		.then(res.json.bind(res), next);
	},
	/**
	 * Middleware for deleting an existing user in database. Must be other than the authenticated user.
	 */
	deleteUser: function (req, res, next) {
		if (providers.authentication.isAuthenticated(req.params.id, req, res))
			return res.json(addFailureToResponse(api_errors.UnableToDeleteError));
		providers.database.Users.delete({id: req.params.id})
		.then(makeSuccessJSONResponseForUser, rejectionHandler)
		.then(res.json.bind(res), next);
	},

	/**
	 * Middleware for retrieving the list of profiles.
	 */
	getProfiles: function (req, res, next) {
		providers.database.Profiles.list()
		.then(makeSuccessJSONResponseFor('profiles'))
		.then(res.json.bind(res), next);
	},
	/**
	 * Middleware for retrieving the list of holdings.
	 */
	getHoldings: function (req, res, next) {
		providers.database.Holdings.list()
		.then(makeSuccessJSONResponseFor('holdings'))
		.then(res.json.bind(res), next);
	}
};

  //==============================//
 //      HOISTED FUNCTIONS       //
//==============================//
/**
 * @param {String} key
 * @returns {Function} that creates and returns a JSON success response
 * @arg value set to the JSON response under the key <key>
 */
function makeSuccessJSONResponseFor(key) {
	return function (value) {
		var json = {success: true};
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		json[key] = value;
		return json;
	};
}
var makeSuccessJSONResponseForUser = makeSuccessJSONResponseFor('user');
/**
 * Adds the failure property to the reason response.
 * @param reason
 * @returns reason
 */
function addFailureToResponse(reason) {
	reason.success = false;
	return reason;
}
/**
 * If the reason is known, then it's returned as it's resolved; otherwise it's thrown as it's rejected.
 * @param reason
 * @returns reason
 */
function rejectionHandler(reason) {
	addFailureToResponse(reason);
	if (api_errors.isKnown(reason)) return reason;
	throw reason;
}
/**
 * Removes the password property from the user object to be responded.
 * @param {User} user
 */
function stripPasswordFromUserResponse(user) {
	user.password = undefined;
	return user;
}
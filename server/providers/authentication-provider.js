'use strict';

/**
 * @interface AuthenticationProvider
 * {Function} verify(onFailure): returns a middleware that verifies there is an authenticated state.
 *     The middleware make modifications to the request and call next() if ok; or
 *     invokes onFailure(err, req, res) otherwise.
 * {Function} allow(json, request, response): adds information to the <json> response and
 *     saves an authenticated state in <request> or <response>.
 * {Function} deny(request, response): adds or removes information to the <json> response and
 *     removes the authenticated state in <request> or <response>.
 *
 * This module is designed to be swappable with another implementation for authentication
 * following this interface.
 * TODO: force interface into module exports
 */

/**
 * module.exports
 * @implements AuthenticationProvider
 * Implements authentication via JSON Web Token.
 * Only minimum security at this point.
 * TODO: improve security
 */

var jwt = require("jsonwebtoken");

var SECRET = 'IT’S A SECRET TO EVERYBODY.';

// variable <app> must be in the global scope at this point.

var MESSAGES = {
	NO_TOKEN: 'No token provided.',
	INVALID_TOKEN: 'Failed to authenticate token.'
};

module.exports = {

	/**
	 * @param {Function} onFailure(err, req, res).
	 * @returns {Function}
	 */
	verify: function (onFailure) {
		return function (req, res, next) {
			// check header or url parameters or post parameters for token
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			if (token) {
				jwt.verify(token, SECRET, function(err, decoded) {
					if (err) {
						if (typeof onFailure === 'function') onFailure({
							error: err,
							message: MESSAGES.INVALID_TOKEN
						}, req, res);
					} else {
						// if everything is good, save to request for use in other routes
						req.decoded = decoded;
						next();
					}
				});
			}
			else if (typeof onFailure === 'function') onFailure({ message: MESSAGES.NO_TOKEN }, req, res);
		}
	},

	/**
	 * @param json .user used as payload to generate a token.
	 * @param request
	 * @param response
	 */
	allow: function (json, request, response) {
		json.token = jwt.sign(json.user, SECRET, {expiresInMinutes: 1440});
		return json;
	},

	// not used.
	deny: function (request, response) {
	}

};
'use strict';

// following variables must be set in the global scope at this point.
// var app;

var jwt = require("jsonwebtoken");

var SECRET = 'IT’S A SECRET TO EVERYBODY.';

var EXPIRATION_TIME = 1440;

var MESSAGES = {
	NO_TOKEN: 'No token provided.',
	INVALID_TOKEN: 'Failed to authenticate token.'
};

/**
 * module.exports
 * @implements AuthenticationProvider
 * Implements authentication via JSON Web Token.
 * Only minimum security at this point.
 * TODO: improve security
 */
module.exports = {
	/**
	 * @param {failureCallback} onFailure(err, req, res)
	 * @returns {Middleware}
	 * TODO: convert to returning a promise instead of a middleware?
	 */
	verificationMiddleware: function (onFailure) {
		return function (req, res, next) {
			// check header or url parameters or post parameters for token
			var token = req.body.token || req.query.token || req.headers['x-access-token'];
			if (token) {
				jwt.verify(token, SECRET, function(err, decoded) {
					if (!err) {
						// if everything is good, save to request for use in other routes
						req.decoded = decoded;
						next();
					} else {
						if (typeof onFailure === 'function') onFailure({
							error: err,
							message: MESSAGES.INVALID_TOKEN
						}, req, res);
					}
				});
			}
			else if (typeof onFailure === 'function') onFailure({ message: MESSAGES.NO_TOKEN }, req, res);
		}
	},

	/**
	 * @param json - json.user used as payload to generate a token.
	 * @param req
	 * @param res
	 */
	allow: function (json, req, res) {
		json.token = jwt.sign(json.user, SECRET, {expiresInMinutes: EXPIRATION_TIME});
		return json;
	},

	/**
	 * @param inf - expects an user id to compare against the decoded user id.
	 * @param req
	 * @param res
	 */
	isAuthenticated: function (inf, req, res) {
		return req.decoded.id == inf;
	}
};
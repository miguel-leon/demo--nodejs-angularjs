'use strict';

// following variables must be set in the global scope at this point.
// var providers;

var INVALID_CREDENTIALS_ERROR = {
	success: false,
	user: null,
	invalidCredentials: true
};

/**
 * module.exports middlewares for authentication.
 * The middlewares use the argument <next> as an error handler for unhandled/unknown internal errors
 * passed in a promise. Calling next(error) should look for the next error handler middleware.
 * In case there is none, it defaults to the in-built error handler added by express.
 */
module.exports = {
	/**
	 * Middleware for restricted API routes.
	 * TODO: use next(error) as error handler instead of function onFailure?
	 */
	restrict: providers.authentication.verificationMiddleware(function (err, req, res) {
		err.success = false;
		err.unauthorized = true;
		res.status(403).json(err);
	}),

	/**
	 * Middleware for attempting to authenticate with credentials
	 */
	attempt: function (req, res, next) {
		if (!req.body.email || !req.body.password) return res.json({success: false}); // client hacked

		providers.database.Users.find({email: req.body.email})
		.then(function (user) {
				return providers.security.compare(req.body.password, user.password)
					.then(function (same) {
						if (!same) return INVALID_CREDENTIALS_ERROR;
						user.password = undefined; // strip password from user response
						return providers.authentication.allow({user: user, success: true}, req, res);
					});
			},
			function (reason) { // nonexistent user
				return INVALID_CREDENTIALS_ERROR;
			})
		.then(res.json.bind(res), next);
	}
};


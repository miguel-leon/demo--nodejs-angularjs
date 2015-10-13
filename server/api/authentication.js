'use strict';

// following variables must be set in the global scope at this point.
// var providers;

/**
 * module.exports middlewares for authentication
 */
module.exports = {
	/**
	 * Middleware for restricted API routes.
	 */
	restrict: providers.authentication.verify(function (err, req, res) {
		err.success = false;
		err.unauthorized = true;
		res.status(403).json(err);
	}),

	/**
	 * Middleware for attempting to authenticate with credentials
	 */
	attempt: function (req, res) {
		providers.database.Users.find({
			email: req.body.email,
			password: req.body.password
		}).then(
			function (user) {
				var json = {user: user};
				if (json.user) {
					json = providers.authentication.allow(json, req, res);
					json.success = true;
					res.json(json);
				} else {
					json.success = false;
					json.invalidCredentials = true;
					res.json(json);
				}
			},
			function (err) {
				err.success = false;
				res.status(500).json(err);
			}
		);
	}
};

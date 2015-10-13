'use strict';

// variable <providers> must be in the global scope at this point.

/**
 * module.exports middlewares for authentication
 */
module.exports = {
	restrict: providers.authentication.verify(function (err, req, res) {
		err.success = false;
		err.unauthorized = true;
		res.status(403).json(err);
	}),

	attempt: function (req, res) {
		var json = {
			user: providers.database.Users.find({
				email: req.body.email,
				password: req.body.password
			})
		};
		if (json.user) {
			json = providers.authentication.allow(json, req, res);
			json.success = true;
			res.json(json);
		}
		else {
			json.success = false;
			json.invalidCredentials = true;
			res.json(json);
		}
	}
};

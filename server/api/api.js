'use strict';

// following variables must be set in the global scope at this point.
// var providers;

/**
 * module.exports middlewares for server api
 */
module.exports = {
	/**
	 * Middleware for retrieving the list of users.
	 */
	getUserList: function (req, res) {
		providers.database.Users.list().then(
			successHandlerFor('users', res),
			errorHandler(res)
		);
	},
	/**
	 * Middleware for retrieving a single user data.
	 */
	getUser: function (req, res) {
		providers.database.Users.find({id: req.params.id}).then(
			function (user) {
				if (!user) errorHandler(res)({user: null, nonexistentUser: true});
				else successHandlerFor('user', res)(user);
			}//,
			//errorHandler(res)
		);
	},
	/**
	 * Middleware for creating new user.
	 */
	createUser: function (req, res) {
		delete req.body.id; // in case of client hacked
		providers.database.Users.save(req.body).then(
			successHandlerFor('user', res),
			errorHandler(req)
		);
	},
	/**
	 * Middleware to modify an existing user.
	 */
	updateUser: function (req, res) {
		providers.database.Users.update(req.body).then(
			function (user) {
				res.json(user);
			},
			function (reason) {
				res.json(reason);
			}
		);
		//try {
		//}
		//catch (err) {
		//	err.success = false;
		//	err.user = null;
		//	return res.json(err);
		//}
		//if (!user) res.json({success: false, user: null, nonexistentUser: true});
		//else res.json({success: true, user: user});
	},
	/**
	 * Middleware for deleting an existing user in database. Must be other than the authenticated user.
	 */
	deleteUser: function (req, res) {
		if (req.params.id == req.decoded.id) return res.json({success:false, unableToDelete: true});
		providers.database.Users.delete({id: req.params.id}).then(
			function (user) {
				res.json(user);
			},
			function (reason) {
				res.json(reason);
			}
		);
		//var user = ;
		//if (!user) return res.json({success:false, nonexistentUser: true});
		//res.json({success: true});
	}
};

  //==============================//
 //      HOISTED FUNCTIONS       //
//==============================//
function successHandlerFor(key, res) {
	return function (value) {
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		var json = {success: true};
		json[key] = value;
		res.json(json);
	}
}

function errorHandler(res) {
	return function (err) {
		err.success = false;
		res.json(err);
	}
}


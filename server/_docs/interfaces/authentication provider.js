/**
 * In order for Authentication Providers to be swappable, they need to implement the following interface.
 * Put implementing objects in path: server/providers/
 * Name implementing objects with filename: XXXXX_authentication-provider.js
 * @interface AuthenticationProvider
 */
module.exports = {
	/**
	 * @callback Middleware
	 * @arg req - The request.
	 * @arg res - The response.
	 * @arg {Function} next - Function to proceed to the next middleware.
	 */
	/**
	 * @callback failureCallback
	 * @arg err	- The error.
	 * @arg req - The request.
	 * @arg res - The response.
	 */
	/**
	 * returns an Express Middleware that verifies there is an authenticated state using the request object.
	 * This middleware may make modifications to the request object and call next() if authenticated;
	 * Or invoke onFailure(err, req, res) otherwise.
	 * @param {failureCallback} onFailure(err, req, res)
	 * @returns {Middleware}
	 */
	verify: function (onFailure) {},

	/**
	 * Adds information to the <json> response.
	 * May save an authenticated state in the request or the response.
	 * @param json to be responded to the client
	 * @param req - The request.
	 * @param res - The response.
	 */
	allow: function (json, req, res) {},

	/* NOT USED */
	deny: function (req, res) {}
};

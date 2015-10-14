/**
 * In order for Authentication Providers to be swappable, they need to implement the following interface.
 * Put implementing objects in path: server/providers/
 * Name implementing objects with filename: XXXXX_authentication-provider.js
 * @interface AuthenticationProvider
 */
module.exports = {
	/**
	 * @callback Middleware
	 * @arg req - The request object.
	 * @arg res - The response object.
	 * @arg next - Function to proceed to the next middleware.
	 */
	/**
	 * @callback failureCallback
	 * @arg err	- The error.
	 * @arg req - The request object.
	 * @arg res - The response object.
	 */
	/**
	 * Returns an Express Middleware that verifies there is valid authentication information in the request object.
	 * The middleware may add information to the request object.
	 * The middleware must call next() if the authentication information is valid,
	 * Or invoke onFailure(err, req, res) otherwise.
	 * @param {failureCallback} onFailure(err, req, res)
	 * @returns {Middleware}
	 */
	verificationMiddleware: function (onFailure) {},

	/**
	 * Adds information to the json object that will be responded back to the client.
	 * The method may add authentication information in the request or response objects.
	 * @param json to be responded to the client
	 * @param req - The request object.
	 * @param res - The response object.
	 * @returns json
	 */
	allow: function (json, req, res) {},

	/**
	 * Checks if the information provided correspond to the authentication information
	 * stored in the request or response object.
	 * @param inf
	 * @param req - The request object.
	 * @param res - The response object.
	 * @returns {Boolean}
	 */
	isAuthenticated: function (inf, req, res) {}
};

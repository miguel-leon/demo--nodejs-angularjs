/**
 * In order for Security Providers to be swappable, they need to implement the following interface.
 * Put implementing objects in path: server/providers/
 * Name implementing objects with filename: XXXXX_security-provider.js
 * @interface SecurityProvider
 */
module.exports = {
	/**
	 * @param {String} password to be hashed
	 * @returns {Promise.<String>}
	 * @throws
	 */
	hash: function (password) {},
	/**
	 * Compares unencrypted <password> against <encrypted>
	 * @param {String} password
	 * @param {String} encrypted
	 * @returns {Promise.<Boolean>}
	 * @throws
	 */
	compare: function (password, encrypted) {}
};

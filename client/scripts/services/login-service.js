'use strict';

angular.module('Demo-NodeJS.services')

.factory('login', function (CONFIG, $http, $q, $location, storage) {
	return {
		saveAuthenticationFrom: saveAuthenticationFrom,
		/**
		 * @param user logging in
		 * @returns a {Promise}
		 */
		attempt: function (user) {
			return $http.post(CONFIG.ROUTES.API.AUTHENTICATE, user).then(
				function (response) { // success
					if (!response.data.success) return $q.reject(response.data);
					saveAuthenticationFrom(response.data);
					return response.data;
				});
		},

		dismiss: function () {
			storage.delete(CONFIG.AUTHENTICATION.STORAGE_KEY_TOKEN);
			storage.delete(CONFIG.AUTHENTICATION.STORAGE_KEY_USER);
			$location.path(CONFIG.ROUTES.UNAUTHENTICATED_ENTRY);
		},

		hasCredentials: hasCredentials,
		loggedUser: loggedUser,

		/**
		 * Compares the id against the logged user's id.
		 * @param id of an user
		 * @returns {boolean}
		 */
		allowedDeletionFor: function (id) {
			return id != loggedUser().id;
		},

		headersConfig: function () {
			var config = {
				headers: {}
			};
			// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
			config.headers[CONFIG.AUTHENTICATION.HEADER_KEY_TOKEN] =
				storage.get(CONFIG.AUTHENTICATION.STORAGE_KEY_TOKEN);
			return config;
		}
	};

	// HOISTED FUNCTIONS
	function hasCredentials() {
		return !!storage.get(CONFIG.AUTHENTICATION.STORAGE_KEY_TOKEN);
	}
	function loggedUser() {
		// the logged user may be saved in a variable to avoid continuous JSON parsing.
		if (hasCredentials()) return storage.getJSON(CONFIG.AUTHENTICATION.STORAGE_KEY_USER);
		return null;
	}
	function saveAuthenticationFrom(data) {
		storage.set(CONFIG.AUTHENTICATION.STORAGE_KEY_TOKEN, data.token);
		storage.setJSON(CONFIG.AUTHENTICATION.STORAGE_KEY_USER, data.user);
	}
});
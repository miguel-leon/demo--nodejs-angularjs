'use strict';

angular.module('Demo-NodeJS.services')

.factory('serverAPI', function (CONFIG, $http, $q, login, notification) {
	var emptyPromise = $q.defer().promise;

	function handleRejectedAPIRequest (response) {
		var reason = response.data;
		if (reason[CONFIG.API_BAD_RESPONSES.UNAUTHORIZED]) {
			notification.push(CONFIG.NOTIFICATIONS.NO_CREDENTIALS);
			login.dismiss();
			return emptyPromise; // return of empty promise, halts the promise chain.
		}
		// unknown rejection
		notification.push(CONFIG.NOTIFICATIONS.GENERIC_ERROR);
		return emptyPromise; // return of empty promise, halts the promise chain.
	}

	function handleAcceptedAPIRequest (response) {
		if (!response.data.success) return $q.reject(response.data);
		return response.data;
	}

	return {
		Users: {
			/**
			 * @returns a Promise
			 */
			list: function () {
				return $http.get(CONFIG.ROUTES.API.USER_LIST, login.headersConfig()).then(
					handleAcceptedAPIRequest,
					handleRejectedAPIRequest
				);
			},
			/**
			 * @param id of the user to find
			 * @returns a Promise
			 */
			find: function (id) {
				return $http.get(CONFIG.ROUTES.API.USER+'\/' + id, login.headersConfig()).then(
					handleAcceptedAPIRequest,
					handleRejectedAPIRequest
				);
			},
			create: function (user) {
				return $http.post(CONFIG.ROUTES.API.USER, user, login.headersConfig()).then(
					handleAcceptedAPIRequest,
					handleRejectedAPIRequest
				);
			},
			modify: function (user) {
				return $http.put(CONFIG.ROUTES.API.USER, user, login.headersConfig()).then(
					handleAcceptedAPIRequest,
					handleRejectedAPIRequest
				);
			},
			delete: function (id) {
				return $http.delete(CONFIG.ROUTES.API.USER+'\/' + id, login.headersConfig()).then(
					handleAcceptedAPIRequest,
					handleRejectedAPIRequest
				);
			}
		}
	}
});
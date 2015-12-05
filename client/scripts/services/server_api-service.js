'use strict';

angular.module('Demo-NodeJS.services')

.factory('serverAPI', function ($http, $q, CONFIG, login, notification) {
	var emptyPromise = $q.defer().promise;

	// Caches for profiles and holdings
	var cache = {
		profiles: null,
		holdings: null
	};

	// All methods return Promises
	return {
		Users: {
			list: function () {
				return $http.get(CONFIG.ROUTES.API.USERS, login.headersConfig())
				.then(handleAcceptedAPIRequest, handleRejectedAPIRequest);
			},
			find: function (id) {
				return $http.get(CONFIG.ROUTES.API.USERS + '\/' + id, login.headersConfig())
				.then(handleAcceptedAPIRequest, handleRejectedAPIRequest);
			},
			create: function (user) {
				return $http.post(CONFIG.ROUTES.API.USERS, user)
				.then(handleAcceptedAPIRequest, handleRejectedAPIRequest);
			},
			modify: function (user) {
				return $http.put(CONFIG.ROUTES.API.USERS + '\/' + user.id, user, login.headersConfig())
				.then(handleAcceptedAPIRequest, handleRejectedAPIRequest);
			},
			delete: function (id) {
				return $http.delete(CONFIG.ROUTES.API.USERS + '\/' + id, login.headersConfig())
				.then(handleAcceptedAPIRequest, handleRejectedAPIRequest);
			}
		},
		Profiles: {
			list: cachedListFor.bind(null, 'profiles', CONFIG.ROUTES.API.PROFILES, convertToArrayLikeById)
		},
		Holdings: {
			list: cachedListFor.bind(null, 'holdings', CONFIG.ROUTES.API.HOLDINGS, convertToArrayLikeById)
		}
	};

	// HOISTED FUNCTIONS
	function handleAcceptedAPIRequest (response) {
		if (!response.data.success) return $q.reject(response.data);
		return response.data;
	}

	function handleRejectedAPIRequest (response) {
		var reason = response.data;
		if (reason[CONFIG.API_BAD_RESPONSES.UNAUTHORIZED]) {
			notification.push(CONFIG.NOTIFICATIONS.NO_CREDENTIALS);
			login.dismiss();
			return emptyPromise; // return of empty promise, halts the promise chain.
		}
		// unknown rejection
		notification.pushAndPop(CONFIG.NOTIFICATIONS.GENERIC_ERROR);
		return emptyPromise; // return of empty promise, halts the promise chain.
	}

	function convertToArrayLikeById(arr) {
		return arr.reduce(function (arraylike, item) {
			arraylike[item.id] = item;
			return arraylike;
		}, {});
	}

	function cachedListFor(key, route, filter) {
		if (!cache[key]) {
			return $http.get(route, login.headersConfig()).then(
				handleAcceptedAPIRequest,
				handleRejectedAPIRequest
			).then(
				function (data) {
					if (!filter) cache[key] = data[key];
					else data[key] = cache[key] = filter(data[key]);
					return data;
				}
			);
		}
		var deferred = $q.defer();
		var res = {success: true};
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		res[key] = cache[key];
		deferred.resolve(res);
		return deferred.promise;
	}
});

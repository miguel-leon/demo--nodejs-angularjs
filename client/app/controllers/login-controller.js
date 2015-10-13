'use strict';

angular.module('Demo-NodeJS.controllers')

.controller('LoginController', function (CONFIG, $scope, $location, login, notification) {
	// Set up
	notification.setScope($scope);
	$scope.user = {};

	// functions for buttons
	$scope.register = function () {
		$location.path(CONFIG.ROUTES.APP.USER);
	};

	$scope.login = function () {
		login.attempt($scope.user).then(
			function (response) { // success
				$location.path(CONFIG.ROUTES.AUTHENTICATED_ENTRY);
			},
			function (reason) { // failure
				if (reason.invalidCredentials) {
					notification.push(CONFIG.NOTIFICATIONS.INVALID_CREDENTIALS);
				}
			});
	};
});

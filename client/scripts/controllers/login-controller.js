'use strict';

angular.module('Demo-NodeJS.controllers')

.controller('LoginController', function (CONFIG, userHelpers, $scope, $location, login, notification) {
	// Set up
	notification.setScope($scope);
	$scope.user = {}; // no need to register this controller with userHelpers.broadcast

	// functions for buttons
	$scope.register = function () {
		userHelpers.broadcast.user.publish($scope.user);
		$location.path(CONFIG.ROUTES.APP.USER);
	};

	$scope.login = function () {
		if ($scope.loginForm.$invalid) return;
		login.attempt($scope.user).then(
			function (response) { // success
				$location.path(CONFIG.ROUTES.AUTHENTICATED_ENTRY);
			},
			function (reason) { // failure
				if (reason.invalidCredentials) notification.pushAndPop(CONFIG.NOTIFICATIONS.INVALID_CREDENTIALS);
				else notification.pushAndPop(CONFIG.NOTIFICATIONS.GENERIC_ERROR);
			});
	};
});

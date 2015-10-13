'use strict';

angular.module('Demo-NodeJS.controllers')

.controller('UserListController',
function (CONFIG, $scope, $location, serverAPI, login, userHelpers, notification) {
	// Set up
	notification.setScope($scope);
	userHelpers.broadcast.register('UserListController', $scope);
	$scope.undeletable = login.disallowedDeletionFor;

	// Run
	serverAPI.Profiles.list().then(
		function (data) {
			$scope olhoih
		}
	);
	serverAPI.Users.list().then(function (data) { // success
		$scope.users = data.users;
	}); // no failure other than unauthorized, handled by server api service

	// functions for buttons
	$scope.register = function () {
		$location.path(CONFIG.ROUTES.APP.USER);
	};
	
	$scope.edit = function (index, id) {
		userHelpers.broadcast.publish($scope.users[index]);
		$location.path(CONFIG.ROUTES.APP.USER + '\/' + id);
	};

	$scope.delete = function (index, id) {
		if (confirm(CONFIG.NOTIFICATIONS.USER.CONFIRM_DELETION))
		serverAPI.Users.delete(id).then(
			// success handlers
			userHelpers.publishFromResponse.and(userHelpers.asDeleted)
				.and(function () { $scope.users.splice(index, 1); }),
			// failure handlers, both are only reachable if the page was hacked
			userHelpers.isNonexistent.or(userHelpers.isUndeletable));
	};
});
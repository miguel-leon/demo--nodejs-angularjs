'use strict';

angular.module('Demo-NodeJS.controllers')

.controller('UserController',
function (CONFIG, $scope, $location, $routeParams, serverAPI, userHelpers, login, notification) {
	// Set up
	notification.setScope($scope);
	userHelpers.broadcast.register('UserController', $scope);
	var redirectToUserList = function () { $location.path(CONFIG.ROUTES.APP.USER_LIST); };
	var conditionalRedirect = login.hasCredentials()?
		redirectToUserList:
		function () { $location.path(CONFIG.ROUTES.APP.LOGIN); };

	// Run
	if (!$routeParams.id) { // new user
		$scope.new_user = true;
		userHelpers.broadcast.publish({}); // publish empty user
		$scope.undeletable = true;
		$scope.save = createUser; // function for button, function hoisted
	}
	else { // existing user
		$scope.new_user = false;
		if ($routeParams.id != $scope.user.id) { // manually changed id in url
			serverAPI.Users.find($routeParams.id).then(
				userHelpers.publishFromResponse, // success handler
				userHelpers.isNonexistent.and(conditionalRedirect)); // failure handler
		}
		if (!($scope.undeletable = login.disallowedDeletionFor($routeParams.id))) {
			$scope.delete = deleteUser; // function for button
		}
		$scope.save = modifyUser; // function for button
	}

	// function for button
	$scope.cancel = conditionalRedirect;

	function createUser() {
		serverAPI.Users.create($scope.user).then(
			// success handlers
			userHelpers.publishFromResponse.and(userHelpers.asCreated).and(conditionalRedirect),
			// failure handlers
			userHelpers.isIncomplete.or(userHelpers.isDuplicated));
	}

	function modifyUser() {
		if ($scope.user.id != login.loggedUser().id ||
			confirm(CONFIG.NOTIFICATIONS.USER.CONFIRM_LOGGED_MODIFICATION))
		serverAPI.Users.modify($scope.user).then(
			// success handlers
			userHelpers.modifyLoggedUser.or
			(userHelpers.publishFromResponse.and(userHelpers.asModified).and(redirectToUserList)),
			// failure handlers
			userHelpers.isIncomplete.or(userHelpers.isDuplicated.or
			(userHelpers.isNonexistent.or(userHelpers.isInvalidPassword))));
	}

	function deleteUser() {
		if (confirm(CONFIG.NOTIFICATIONS.USER.CONFIRM_DELETION))
		serverAPI.Users.delete($scope.user.id).then(
			// success handlers
			userHelpers.publishFromResponse.and(userHelpers.asDeleted).and(redirectToUserList),
			// failure handlers
			userHelpers.isNonexistent.or(userHelpers.isUndeletable));
	}
});

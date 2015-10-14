'use strict';

angular.module('Demo-NodeJS.controllers')

.controller('UserListController',
function (CONFIG, $scope, $location, $q, serverAPI, login, userHelpers, notification) {
	// SET UP
	notification.setScope($scope);
	userHelpers.broadcast.register('UserListController', $scope);
	$scope.undeletable = login.disallowedDeletionFor;

	// RUN
	// unauthorized or unknown failures, handled by server api service
	$q.all([
		serverAPI.Profiles.list().then(userHelpers.publishProfilesFromResponse),
		serverAPI.Holdings.list().then(userHelpers.publishHoldingsFromResponse),
		serverAPI.Users.list().then(function (data) {
			$scope.users = data.users;
		})
	]).then(function () {
		$scope.users.forEach(function (user) {
			user.profile = $scope.profiles[user.profile_id];
			user.holding = $scope.holdings[user.holding_id];
		});
	});

	// FUNCTION FOR BUTTONS
	$scope.register = function () {
		userHelpers.broadcast.user.publish({});
		$location.path(CONFIG.ROUTES.APP.USER);
	};
	
	$scope.edit = function (index, id) {
		userHelpers.broadcast.user.publish($scope.users[index]);
		$location.path(CONFIG.ROUTES.APP.USER + '\/' + id);
	};

	$scope.delete = function (index, id) {
		if (confirm(CONFIG.NOTIFICATIONS.USER.CONFIRM_DELETION))
		serverAPI.Users.delete(id).then(
			// success handlers
			userHelpers.publishFromResponse.and(userHelpers.asDeleted)
				.and(function () {
					$scope.users.splice(index, 1);
					notification.pop();
				}),
			// failure handlers, both are only reachable if the page was hacked
			userHelpers.isNonexistent.or(userHelpers.isUndeletable));
	};
});
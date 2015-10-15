'use strict';

angular.module('Demo-NodeJS.services')

/**
 * Service used only for communicating notifications between controllers.
 * Implements a queue of size 1 pattern.
 * The $scope.notification_alert attribute should be only modified here.
 * Then notification_alert is only consumed in templates/partials/alert-notification.html
 */
.factory('notification', function () {
	var scope = {};
	var notification = null;
	function clearNotification() {
		scope.notification_alert = null;
	}

	var service = {
		push: function (new_notification) {
			scope.notification_alert = notification = new_notification;
		},
		pop: function () {
			var prev_notification = notification;
			notification = null;
			return prev_notification;
		},

		pushAndPop: function (new_notification) {
			scope.notification_alert = new_notification;
			notification = null;
		},
		setScope: function (new_scope) {
			scope = new_scope;
			scope.notification_alert = service.pop();
			scope.clearNotification = clearNotification;
		}
	};

	return service;
});

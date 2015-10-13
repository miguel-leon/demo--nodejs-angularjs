'use strict';

angular.module('Demo-NodeJS.services')

/**
 * Service used only for communicating notifications between controllers.
 * Implements a queue of size 1 pattern.
 * The $scope.notification_alert attribute should be only modified here.
 * Then notification_alert is only consumed in views/partials/alert-notification.html
 */
.factory('notification', function () {
	var scope = {};
	var notification = {};

	return {
		push: function (new_notification) {
			scope.notification_alert = notification = new_notification;
		},
		pop: function () {
			var prev_notification = notification;
			notification = {};
			return prev_notification;
		},

		pushAndPop: function (new_notification) {
			scope.notification_alert = new_notification;
			notification = {};
		},
		setScope: function (new_scope) {
			scope = new_scope;
			scope.notification_alert = this.pop();
		}
	};
});

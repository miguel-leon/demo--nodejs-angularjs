'use strict';

angular.module('Demo-NodeJS.services')

/**
 * Service used only for communicating notifications between controllers.
 * Implements a queue of size 1 pattern.
 */
.factory('notification', function () {
	var scope = {};
	var notification = {};
	function pop() {
		var prev_notification = notification;
		notification = {};
		return prev_notification;
	}

	return {
		push: function (new_notification) {
			scope.notification_alert = notification = new_notification;
		},
		pop: pop,
		setScope: function (new_scope) {
			scope = new_scope;
			scope.notification_alert = pop();
		}
	};
});

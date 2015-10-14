'use strict';

angular.module('Demo-NodeJS.services')

.factory('userHelpers', function (CONFIG, functionChainer, notification, Broadcast, login) {
	var broadcast = new Broadcast(['user', 'profiles', 'holdings']);

	return {
		broadcast: broadcast,

		// API actions success handlers
		publishFromResponse: publishFromResponseFunctionFor('user'),
		publishProfilesFromResponse: publishFromResponseFunctionFor('profiles'),
		publishHoldingsFromResponse: publishFromResponseFunctionFor('holdings'),
		modifyLoggedUser: functionChainer(function (data) { // not used
			if (data.user.id === login.loggedUser().id) {
				notification.push(CONFIG.NOTIFICATIONS.USER.MODIFIED_LOGGED);
				login.dismiss();
				return true;
			}
			return false;
		}),
		checkIfModifiedLoggedUser: functionChainer(function (data) {
			if (data.user.id === login.loggedUser().id) {
				login.saveAuthenticationFrom(data);
			}
		}),
		// the following functions are used for pushing notifications.
		asCreated: pushNotificationFunction(CONFIG.NOTIFICATIONS.USER.CREATED),
		asModified: pushNotificationFunction(CONFIG.NOTIFICATIONS.USER.MODIFIED),
		asDeleted: pushNotificationFunction(CONFIG.NOTIFICATIONS.USER.DELETED),

		// API actions reject handlers
		isIncomplete: rejectionHandlerAndNotificationFunction(
			CONFIG.API_BAD_RESPONSES.USER.INCOMPLETE,
			CONFIG.NOTIFICATIONS.USER.INCOMPLETE
		),
		isDuplicated: rejectionHandlerAndNotificationFunction(
			CONFIG.API_BAD_RESPONSES.USER.DUPLICATED,
			CONFIG.NOTIFICATIONS.USER.DUPLICATED
		),
		isNonexistent: rejectionHandlerAndNotificationFunction(
			CONFIG.API_BAD_RESPONSES.USER.NONEXISTENT,
			CONFIG.NOTIFICATIONS.USER.NONEXISTENT
		),
		isUndeletable: rejectionHandlerAndNotificationFunction(
			CONFIG.API_BAD_RESPONSES.USER.UNDELETABLE,
			CONFIG.NOTIFICATIONS.USER.UNDELETABLE
		),
		isInvalidPassword: rejectionHandlerAndNotificationFunction(
			CONFIG.API_BAD_RESPONSES.USER.INVALID_PASSWORD,
			CONFIG.NOTIFICATIONS.USER.INVALID_PASSWORD
		)
	};

	// Hoisted functions
	function publishFromResponseFunctionFor(key) {
		return functionChainer(function (data) {
			broadcast[key].publish(data[key]);
		});
	}
	function pushNotificationFunction(message) {
		return functionChainer(function () {
			notification.push(message);
		});
	}
	function rejectionHandlerAndNotificationFunction(bad_response, message) {
		return functionChainer(function (reason) {
			if (reason[bad_response]) {
				notification.pushAndPop(message);
				return true;
			}
			return false;
		});
	}
});
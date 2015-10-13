'use strict';

angular.module('Demo-NodeJS.services')

.factory('userHelpers', function (CONFIG, functionChainer, notification, broadcastFactory, login) {
	/**
	 * Specific broadcast for "user" key. Used to persist an user object between controllers.
	 * It inherit the functionality from broadcastFactory
	 */
	var userBroadcast = broadcastFactory('user');

	return {
		broadcast: userBroadcast,

		// API actions success handlers
		modifyLoggedUser: functionChainer(function (data) {
			if (data.user.id === login.loggedUser().id) {
				notification.push(CONFIG.NOTIFICATIONS.USER.MODIFIED_LOGGED);
				login.dismiss();
				return true;
			}
			return false;
		}),
		publishFromResponse: functionChainer(function (data) {
			userBroadcast.publish(data.user);
		}),
		// the following functions are used for pushing notifications.
		asCreated: functionChainer(function () {
			notification.push(CONFIG.NOTIFICATIONS.USER.CREATED);
		}),
		asModified: functionChainer(function () {
			notification.push(CONFIG.NOTIFICATIONS.USER.MODIFIED);
		}),
		asDeleted: functionChainer(function () {
			notification.push(CONFIG.NOTIFICATIONS.USER.DELETED);
		}),

		// API actions reject handlers
		isIncomplete: functionChainer(function (reason) {
			if (reason[CONFIG.API_BAD_RESPONSES.USER.INCOMPLETE]) {
				notification.pushAndPop(CONFIG.NOTIFICATIONS.USER.INCOMPLETE);
				return true;
			}
			return false;
		}),
		isDuplicated: functionChainer(function (reason) {
			if (reason[CONFIG.API_BAD_RESPONSES.USER.DUPLICATED]) {
				notification.pushAndPop(CONFIG.NOTIFICATIONS.USER.DUPLICATED);
				return true;
			}
			return false;
		}),
		isNonexistent: functionChainer(function (reason) {
			if (reason[CONFIG.API_BAD_RESPONSES.USER.NONEXISTENT]) {
				notification.pushAndPop(CONFIG.NOTIFICATIONS.USER.NONEXISTENT);
				return true;
			}
			return false;
		}),
		isUndeletable: functionChainer(function (reason) {
			if (reason[CONFIG.API_BAD_RESPONSES.USER.UNDELETABLE]) {
				notification.pushAndPop(CONFIG.NOTIFICATIONS.USER.UNDELETABLE);
				return true;
			}
			return false;
		}),
		isInvalidPassword: functionChainer(function (reason) {
			if (reason[CONFIG.API_BAD_RESPONSES.USER.INVALID_PASSWORD]) {
				notification.pushAndPop(CONFIG.NOTIFICATIONS.USER.INVALID_PASSWORD);
				return true;
			}
			return false;
		})
	}
});
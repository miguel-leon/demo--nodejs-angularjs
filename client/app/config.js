'use strict';

angular.module('Demo-NodeJS')

.constant('CONFIG', (function () {
		var APP = {
			BASE: '/',
			LOGIN: '/login',
			USER: '/user',
			USER_LIST: '/user_list'
		};

		var VIEWS = {};
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		VIEWS[APP.LOGIN] = '/views/login.html';
		VIEWS[APP.USER] = '/views/user.html';
		VIEWS[APP.USER_LIST] = '/views/user_list.html';
		VIEWS.HEADER = {
			LOGGED: '/views/partials/logged-header.html',
			NOT_LOGGED: '/views/partials/not_logged-header.html'
		};
		VIEWS.NOTIFICATION = {
			ALERT: '/views/partials/alert-notification.html'
		};

		var NOTIFICATION_CLASS = { // css classes
			SUCCESS: 'alert-success',
			ERROR: 'alert-danger',
			WARNING: 'alert-warning'
		};

		return {
			ROUTES: {
				APP: APP,

				UNAUTHENTICATED_ENTRY: APP.LOGIN,
				AUTHENTICATED_ENTRY: APP.USER_LIST,
				NEED_AUTHENTICATION: [APP.USER_LIST],
				API: {
					BASE: '/api',
					AUTHENTICATE: '/api/authenticate',
					USER_LIST: '/api/user_list',
					USER: '/api/user'
				}
			},

			API_BAD_RESPONSES: {
				UNAUTHORIZED: 'unauthorized',
				USER: {
					INCOMPLETE: 'missingData',
					DUPLICATED: 'duplicatedUser',
					NONEXISTENT: 'nonexistentUser',
					UNDELETABLE: 'unableToDelete',
					INVALID_PASSWORD: 'invalidPassword'
				}
			},

			VIEWS: VIEWS,

			AUTHENTICATION: {
				STORAGE_KEY_TOKEN: 'accessToken',
				STORAGE_KEY_USER: 'loggedUser',
				HEADER_KEY_TOKEN: 'x-access-token'
			},

			NOTIFICATIONS: {
				GENERIC_ERROR: {
					message: 'A problem occurred during the last operation',
					class: NOTIFICATION_CLASS.ERROR
				},
				NO_CREDENTIALS: {
					message: 'You don\'t have the necessary credentials to perform the last operation.',
					class: NOTIFICATION_CLASS.ERROR
				},
				INVALID_CREDENTIALS: {
					message: 'The email and\/or password are incorrect.',
					class: NOTIFICATION_CLASS.ERROR
				},
				USER: {
					CREATED: {
						message: 'The new user has been saved successfully.',
						class: NOTIFICATION_CLASS.SUCCESS
					},
					MODIFIED: {
						message: 'The user has been successfully modified.',
						class: NOTIFICATION_CLASS.SUCCESS
					},
					DELETED: {
						message: 'The user has been successfully deleted.',
						class: NOTIFICATION_CLASS.SUCCESS
					},
					NONEXISTENT:  {
						message: 'The user requested does not exist.',
						class: NOTIFICATION_CLASS.WARNING
					},
					INCOMPLETE: {
						message: 'Some fields are missing from the user information.',
						class: NOTIFICATION_CLASS.WARNING
					},
					DUPLICATED: {
						message: 'The user could not be saved. Email already exists.',
						class: NOTIFICATION_CLASS.WARNING
					},
					UNDELETABLE: { // shouldn't be reachable
						message: 'Cannot delete current logged user.',
						class: NOTIFICATION_CLASS.ERROR
					},
					MODIFIED_LOGGED: {
						message: 'The logged user has been successfully modified. Please log in again.',
						class: NOTIFICATION_CLASS.SUCCESS
					},
					INVALID_PASSWORD: {
						message: 'The previous password is invalid.',
						class: NOTIFICATION_CLASS.ERROR
					},
					CONFIRM_DELETION: 'Sure you want to delete this user?',
					CONFIRM_LOGGED_MODIFICATION: 'Sure you want to modify the logged user?'
				}
			}
		};
})());
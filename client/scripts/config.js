'use strict';

angular.module('Demo-NodeJS')

.constant('CONFIG', (function () {
		var APP = {
			BASE: '/',
			LOGIN: '/login',
			USER: '/user',
			USER_LIST: '/user_list'
		};

		var TEMPLATES = {};
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		TEMPLATES[APP.LOGIN] = '/templates/views/login.html';
		TEMPLATES[APP.USER] = '/templates/views/user.html';
		TEMPLATES[APP.USER_LIST] = '/templates/views/user_list.html';
		TEMPLATES.HEADER = {
			LOGGED: '/templates/partials/logged-header.html',
			NOT_LOGGED: '/templates/partials/not_logged-header.html'
		};
		TEMPLATES.NOTIFICATION = {
			ALERT: '/templates/partials/alert-notification.html'
		};
		TEMPLATES.VALIDATION_MESSAGES = {
			FIELD_REQUIRED: 'messages.fieldRequired',
			EMAIL: 'messages.email'
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
					USERS: '/api/users',
					PROFILES: '/api/profiles',
					HOLDINGS: '/api/holdings'
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

			TEMPLATES: TEMPLATES,

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
					INVALID_PASSWORD: {
						message: 'The previous password is invalid.',
						class: NOTIFICATION_CLASS.ERROR
					},
					CONFIRM_DELETION: 'Sure you want to delete this user?'
				}
			}
		};
})())

.run(function($templateCache, $rootScope, CONFIG) {
	$templateCache.put(CONFIG.TEMPLATES.VALIDATION_MESSAGES.FIELD_REQUIRED,
		'<div invalidation="required">This field is required</div>');
	$templateCache.put(CONFIG.TEMPLATES.VALIDATION_MESSAGES.EMAIL,
		'<div invalidation="email">Enter a valid email</div>');

	$rootScope.VALIDATION_MESSAGES = CONFIG.TEMPLATES.VALIDATION_MESSAGES;
});

'use strict';

angular.module('Demo-NodeJS')

.config(function ($routeProvider, $locationProvider, CONFIG) {
	// TODO: fix uncaught exception (URIError: URI malformed) thrown by decodeURIComponent in AngularJS
	// This error is produced when the symbol % is in the URL.
	// It stops $routeProvider from making the redirection.
	var APP_ROUTES = CONFIG.ROUTES.APP;
	$routeProvider
	.when(APP_ROUTES.BASE, {redirectTo: CONFIG.ROUTES.UNAUTHENTICATED_ENTRY})
	.when(APP_ROUTES.LOGIN,	{templateUrl: CONFIG.TEMPLATES[APP_ROUTES.LOGIN], controller: 'LoginController'})
	.when(APP_ROUTES.USER + '\/:id?', {templateUrl: CONFIG.TEMPLATES[APP_ROUTES.USER], controller: 'UserController'})
	.when(APP_ROUTES.USER_LIST, {templateUrl: CONFIG.TEMPLATES[APP_ROUTES.USER_LIST], controller: 'UserListController'})
	.otherwise(APP_ROUTES.BASE);

	$locationProvider.html5Mode({enabled: true, requireBase: false});
})

.run(function ($rootScope, $location, CONFIG, login) {
	// $rootScope's content is only used for index.html and partials outside views handled by controllers.
	// no controller modifies its content.
	$rootScope.NOTIFICATION_ALERT_PATH = CONFIG.TEMPLATES.NOTIFICATION.ALERT;
	// used for href attrs in nav tabs.
	$rootScope.ROUTES = CONFIG.ROUTES.APP;

	// function for button
	$rootScope.logout = login.dismiss;

	/**
	 * Handles entering unauthenticated to routes that need authentication and
	 * entering the login route being already authenticated causing redirection.
	 */
	$rootScope.$on('$routeChangeStart', function () {
		if (login.hasCredentials()) {
			if ($location.url().startsWith(CONFIG.ROUTES.UNAUTHENTICATED_ENTRY)) {
				$location.path(CONFIG.ROUTES.AUTHENTICATED_ENTRY);
			}
		}
		else {
			var NEED_AUTHENTICATION = CONFIG.ROUTES.NEED_AUTHENTICATION;
			for (var i = 0; i < NEED_AUTHENTICATION.length; ++i) {
				if ($location.url().startsWith(NEED_AUTHENTICATION[i])) {
					$location.path(CONFIG.ROUTES.UNAUTHENTICATED_ENTRY);
					return;
				}
			}
		}
	});

	/**
	 * On every change of view, adds to the root scope, a logged user if there is,
	 * an attribute path holding the current path and the routes of the application
	 */
	$rootScope.$on('$routeChangeSuccess', function () {
		// remove params from path
		var path = $location.path();
		var i = path.indexOf('/', 1);
		if (i > 0) path = path.slice(0, i);
		// used for verifications on the templates, as in with the header partial.
		$rootScope.current = {
			user: login.loggedUser(),
			path: {},
			header: login.hasCredentials()?
				CONFIG.TEMPLATES.HEADER.LOGGED: CONFIG.TEMPLATES.HEADER.NOT_LOGGED
		};
		// TODO: Syntax added in ECMAScript® 2015 Language Specification for this purpose.
		$rootScope.current.path[path] = true;
	});
});

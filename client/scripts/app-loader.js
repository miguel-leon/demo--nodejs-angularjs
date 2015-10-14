'use strict';

angular.module('Lib', []);
angular.module('Demo-NodeJS.controllers', []);
angular.module('Demo-NodeJS.services', ['Lib']);
angular.module('Demo-NodeJS.directives', []);

angular.module('Demo-NodeJS',
	['Demo-NodeJS.controllers', 'Demo-NodeJS.services', 'Demo-NodeJS.directives', 'ngRoute']);

DependencyLoader
	.paths({
		'app': "scripts/app.js",
		'config': "scripts/config.js",
		'lib': "",
		'function_chainer': "lib/function_chainer.js",

		'controllers': "",
		'login-controller': "scripts/controllers/login-controller.js",
		'user_list-controller': "scripts/controllers/user_list-controller.js",
		'user-controller': "scripts/controllers/user-controller.js",

		'services': "",
		'login-service': "scripts/services/login-service.js",
		'storage-service': "scripts/services/storage-service.js",
		'server_api-service': "scripts/services/server_api-service.js",
		'broadcast-service': "scripts/services/broadcast-service.js",
		'notification-service': "scripts/services/notification-service.js",
		'user_helper-service': "scripts/services/user_helpers-service.js",

		'directives': "",
		'form_field-directive': "scripts/directives/form_field-directive.js",
		'match_with-directive': "scripts/directives/match_with-directive.js",
		'angular.bootstrap': function() {
			// extracted from https://docs.angularjs.org/guide/bootstrap
			angular.element(document).ready(function() { angular.bootstrap(document, ['Demo-NodeJS']) });
		}
	})
	.dependencies({
		'lib': ['function_chainer'],
		'controllers': ['login-controller', 'user_list-controller', 'user-controller'],
		'services': ['lib', 'login-service', 'storage-service', 'server_api-service',
			'broadcast-service', 'notification-service', 'user_helper-service'],
		'directives': ['form_field-directive', 'match_with-directive'],
		'app': ['controllers', 'services', 'directives'],
		'angular.bootstrap': 'app'
	})
	.loadAll();
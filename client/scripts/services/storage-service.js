'use strict';

angular.module('Demo-NodeJS.services')

// Simplest implementation of a storage service. Just for the sake of simplicity in the demo.
// There are a some better implementations out there. angular-local-storage for example.
// TODO: have a better storage service

.factory('storage', function ($window) {
	return {
		set: function (key, value) {
			$window.sessionStorage[key] = value;
		},
		get: function (key) {
			return $window.sessionStorage[key];
		},
		delete: function (key) {
			$window.sessionStorage[key] = '';
		},
		setJSON: function (key, value) {
			$window.sessionStorage[key] = JSON.stringify(value);
		},
		getJSON: function (key) {
			return JSON.parse($window.sessionStorage[key]);
		}
	}
});
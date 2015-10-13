'use strict';

// Monkey-patching Angular's ng module
// Error: $injector:modulerr Module Error can occur if you try to add your own components to the ng module.
// This has never been supported and from 1.3.0 it will actually trigger this error.
// For instance the following code could trigger this error: angular.module('ng').directive(...)
// So. A custom module should be used.

angular.module('ngExtensions', [])

.directive('ngextRemoveElementIf', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attr) {
			var deregister = scope.$watch(attr.ngextRemoveElementIf, function(newValue, oldValue) {
				if (newValue === undefined) return;
				if (newValue) element.remove();
				else element.removeAttr(attr.$attr.ngextRemoveElementIf);
				deregister();
			});
		}
	}
});


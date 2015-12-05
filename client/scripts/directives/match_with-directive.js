'use strict';

angular.module('Demo-NodeJS.directives')

.directive("matchWith", function() {
	return {
		restrict: 'A',
		require: "?ngModel",
		scope: {
			otherModel: "=matchWith"
		},
		/* jshint unused:true */
		link: function(scope, element, attributes, ngModel) {
			if (!ngModel) return;

			ngModel.$validators.match = function(model) {
				return !model || model === scope.otherModel;
			};

			scope.$watch("otherModel", function() {
				ngModel.$validate();
			});
		}
	};
	/* jshint unused:strict */
});

'use strict';

angular.module('Demo-NodeJS.directives')

.directive("matchWith", function() {
	return {
		restrict: 'A',
		require: "?ngModel",
		scope: {
			otherModel: "=matchWith"
		},
		link: function(scope, element, attributes, ngModel) {
			if (!ngModel) return;

			ngModel.$validators.match = function(model) {
				return model == scope.otherModel;
			};

			scope.$watch("otherModel", function() {
				ngModel.$validate();
			});
		}
	};
});
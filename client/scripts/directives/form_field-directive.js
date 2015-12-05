(function () {'use strict';

angular.module('Demo-NodeJS.directives')

.directive('formGroup', function () { // before transclusion
	return {
		priority: 1,
		compile: function (tElement, tAttrs) {
			tElement.addClass('form-group');

			var tField = tElement.find('input');
			if (!tField.length) tField = tElement.find('select');
			if (tField.length) {
				if (!tField.attr('name')) tField.attr('name', tField.attr('id'));
				tField.addClass('form-control');
				tAttrs.name = tField.attr('name');
			}
		},
		controller: function ($attrs) {
			this.getFieldName = function () {
				return $attrs.name;
			};
		}
	};
})

.directive('formGroup', function () {
	function col(n) { return 'col-sm-'+n; }
	return {
		restrict: 'A',
		transclude: true,
		scope: false,
		compile: function (tElement, tAttrs) {
			if (tAttrs.label) {
				var tLabel = angular.element('<label class="control-label">'+ tAttrs.label +'</label>');
				if (tAttrs.formGroup) tLabel.addClass(col(12 - tAttrs.formGroup));
				tElement.append(tLabel);
			}
			/* jshint unused:true */
			return function link(scope, iElement, iAttrs, _, transclude) {
				transclude(scope, function (clone) {
					var container = iElement;
					if (iAttrs.formGroup) {
						container = angular.element('<div></div>');
						container.addClass(col(iAttrs.formGroup));
						iElement.append(container);
					}
					container.append(clone);
				});

				if (tLabel) {
					var iField = tLabel.next();
					if (iField.attr('id')) tLabel.attr('for', iField.attr('id'));
				}
			};
			/* jshint unused:strict */
		}
	};
})

.directive('validate', function (ngClassDirective) {
	return {
		restrict: 'A',
		require: ['^form', 'formGroup', 'validate'],
		scope: true,
		link: function(scope, iElement, iAttrs, controllers) {
			var formCtrl = controllers[0];
			var formGroupCtrl = controllers[1];
			var validateCtrl = controllers[2];

			scope.showValidation = validateCtrl.showValidation = function() {
				var formField = formCtrl[formGroupCtrl.getFieldName()];
				return formField && (formField.$touched || formCtrl.$submitted);
			};

			iAttrs.ngClass = "{'has-error': showValidation() && " +
				formCtrl.$name + "." + formGroupCtrl.getFieldName() + ".$invalid}";
			ngClassDirective[0].link(scope, iElement, iAttrs);
		},
		controller: function () { /* needed for directives that require it */ }
	};
})


.directive('invalidation', function () {
	return {
		require: ['^form', '^formGroup', '?^validate'],
		template: '<p class="help-block" ng-if="hasError()" ng-transclude></p>',
		transclude: true,
		scope: true,
		/* jshint unused:true */
		link: function (scope, iElement, iAttrs, controllers) {
			var formCtrl = controllers[0];
			var formGroupCtrl = controllers[1];
			var validateCtrl = controllers[2];

			if (!validateCtrl) {
				scope.hasError = function () {
					return false;
				};
			}
			else {
				scope.hasError = function () {
					return validateCtrl.showValidation() &&
						formCtrl[formGroupCtrl.getFieldName()].$error[iAttrs.invalidation];
				};
			}
		}
	};
	/* jshint unused:strict */
})

.directive('placeholderOption', function () {
	return {
		priority: 1,
		restrict: 'A',
		compile: function (tElement, tAttrs) {
			tElement.prepend('<option value="" class="hidden disabled">' +
				(tAttrs.placeholderOption || 'Select one') + '</option>');
		}
	};
})

.directive('parserNames', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		/* jshint unused:true */
		link: function (scope, iElement, iAttrs, ngModel) {
			iAttrs.ngTrim = 'false';
			ngModel.$parsers.push(function (value) {
				var newval = value.replace(/^\s+/, '').replace(/\s+/g, ' ').split('').filter(function (c) {
					return isLetter(c) || /[ '-]/.test(c);
				}).join('');
				if (value !== newval) {
					ngModel.$setViewValue(newval);
					ngModel.$render();
				}
				return newval;
			});

			function isLetter(c) {
				return angular.uppercase(c) !== angular.lowercase(c);
			}
		}
	};
	/* jshint unused:strict */
});

})();


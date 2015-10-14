'use strict';

angular.module('Demo-NodeJS.directives')

.directive('validatedFormGroup', function ($compile) {
	var required = ['id', 'name', 'model', 'label'];

	return {
		restrict: 'E',
		require: '^form',
		transclude: true,
		templateUrl: 'templates/directives/validated-form-group.html',
		compile: function (tElement, tAttrs) {
			var formName = getFormName(tElement.parent());
			var field = formName + "." + tAttrs.name;
			var andTouchedOrSubmitted = " && (" + field + ".$touched || " + formName + ".$submitted)";

			var attrs = tElement[0].attributes;
			tElement = angular.element(tElement.children()[0]);
			setAttrsTo(tElement, attrs, required);
			var errClass = tElement.attr('err-class');

			tElement.attr('ng-class',
			"{" +
				"'" + errClass + "': " + field + ".$invalid" + andTouchedOrSubmitted +
			"}");

			var elemLabel = tElement.find('label');
			elemLabel.attr('for', tAttrs.name);
			elemLabel.append(tAttrs.label);

			var elemTransclude = tElement.find('ng-transclude');
			var relemField = elemTransclude.children()[0];
			var elemHint = angular.element(elemTransclude.children()[1]);

			return function link(scope, iElement, iAttrs) {
				var elemTransclude = tElement.find('ng-transclude');
				var elemField = angular.element(elemTransclude.children()[0]);
				setAttrsTo(elemField, relemField.attributes);
				elemField.attr('id', tAttrs.id);
				elemField.attr('name', tAttrs.name);
				elemField.attr('ng-model', tAttrs.model);

				var elemErrors = iElement.children().find('errors');
				if (elemErrors.length) replaceErrorElements(elemErrors.children(), elemHint);
				elemErrors.replaceWith(elemErrors.children());

				elemTransclude.replaceWith(elemTransclude.children());

				//console.log(iElement.html());
				var iElementChildren = iElement.children();
				iElement.replaceWith(iElementChildren);

				$compile(iElementChildren)(scope);
			};

			function replaceErrorElements(errors, replacement) {
				for (var i = 0; i < errors.length; ++i) {
					var elemError = angular.element(errors[i]);
					var on = elemError.attr('on');
					on = on? "." + on: "";
					var newErrorElem = replacement.clone();
					newErrorElem.attr('ng-if', field + ".$error" + on + andTouchedOrSubmitted);
					newErrorElem.append(elemError.contents());
					elemError.replaceWith(newErrorElem);
				}
			}
		}
	};

	function getFormName(element) {
		if (element[0].tagName == 'FORM') return element.attr('name');
		return getFormName(element.parent());
	}

	function setAttrsTo(element, attrs, excluded) {
		for (var i = 0; i < attrs.length; ++i) {
			if (excluded && excluded.indexOf(attrs[i].name) >= 0) continue;
			if (attrs[i].name == 'class') element.addClass(attrs[i].value);
			else element.attr(attrs[i].name, attrs[i].value);
		}
	}


});
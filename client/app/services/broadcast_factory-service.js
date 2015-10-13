'use strict';

angular.module('Demo-NodeJS.services')

/**
 * Service used to construct specific communication services between controllers.
 * It implements a broadcasting pattern. Specific communication services inherit functionality from this.
 * Communication in only one way publishing for better control of the object being transferred.
 * Scopes need to be registered with the specific service, and a key-value is broadcasted to them.
 */
.factory('broadcastFactory', function () {
	return function (name_broadcasted) {
		var scopes = {};
		var value_broadcasted = {};

		function broadcast() {
			for (var scope_name in scopes) {
				if (scopes.hasOwnProperty(scope_name)) // probably unneeded
					scopes[scope_name][name_broadcasted] = value_broadcasted;
			}
		}

		return {
			register: function (scope_name, scope_obj) {
				scope_obj[name_broadcasted] = value_broadcasted;
				scopes[scope_name] = scope_obj;
				return this; // for chained calls.
			},

			publish: function (new_value_broadcasted) {
				value_broadcasted = new_value_broadcasted;
				broadcast();
				return this; // for chained calls.
			}
		}
	};
});

'use strict';

angular.module('Lib')

/**
 * Implements a pattern for a function chain. Simple but powerful concept that allows function callbacks
 * to be concatenated. Actions may be separated and reused in combinations.
 * Very useful for creating callbacks for promises. Several error checking actions can be chained
 * and reused. Syntactically simple, semantically correct and very legible.
 * Usage: functionChainer(fun1);
 * fun1.or(fun2) returns a function that executes fun1, if it didn't return true, then executes fun2.
 * fun1.and(fun2) returns a function that executes fun1 and then fun2.
 */
.factory('functionChainer', function () {
	function and(fun) {
		var self = this;
		function chained() {
			self.apply(this, arguments);
			return fun.apply(this, arguments);
		}
		chained.and = and;
		return chained;
	}

	function or(fun) {
		var self = this;
		function chained() {
			if (!self.apply(this, arguments))
				return fun.apply(this, arguments);
		}
		chained.or = or;
		chained.and = and;
		return chained;
	}

	return function (fun) {
		fun.and = and;
		fun.or = or;
		return fun;
	};
});

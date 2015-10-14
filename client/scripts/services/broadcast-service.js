'use strict';

angular.module('Demo-NodeJS.services')

/**
 * Service returns a constructor. Instances are used for communication between controllers.
 * Instantiate as another service and specify in the constructor, the keys that it will broadcast.
 * This class implements a broadcasting pattern:
 * Communication in only one way publishing for better control of the object being transferred.
 * Scopes need to be registered with the specific service, and a key-value is broadcasted to them.
 * @example
 * module.factory('myBroadcast', function(Broadcast) {
 *     return new Broadcast(['item1', 'item2']);
 * };
 * module.controller('MyController', function ($scope, myBroadcast) {
 *     myBroadcast.register('MyController', $scope);
 *     myBroadcast.item1.publish('new value');
 *     $scope.item1 === 'new value'; // true
 * });
 */
.factory('Broadcast', function () {
	/**
	 * Broadcast constructor.
	 * @param {Array.<String>} keys the broadcast works for
	 */
	function Broadcast(keys) {
		this.scopes = {}; // scopes registered
		this.keys = keys; // keys available for broadcasting
		var keyPrototype = {
			publish: publish, // function to publish a new value
			broadcast: this // back reference
		};
		keys.forEach(function (key) {
			this[key] = Object.create(keyPrototype);
			this[key].key = key; // key to be broadcasted
			this[key].value = null; // value to be broadcasted
		}, this);
	}

	Broadcast.prototype.register = function (scope_name, scope_obj) {
		this.scopes[scope_name] = scope_obj;
		this.keys.forEach(function (key) { // for each key, update the scope
			scope_obj[key] = this[key].value;
		}, this);
	};

	function publish(value) {
		this.value = value;
		for (var scope_name in this.broadcast.scopes) { // for each scope, update the key
			//noinspection JSUnfilteredForInLoop
			this.broadcast.scopes[scope_name][this.key] = value;
		}
	}

	return Broadcast;
});

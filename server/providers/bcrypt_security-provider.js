'use strict';

// following variables must be set in the global scope at this point.
// var CONFIG;

var bcrypt = require('bcryptjs');
var Promise = require('promise');

var PROCESSING_ROUNDS = 8;

function handler(resolve, reject){
	return function (err, value) {
		if (!err) resolve(value);
		else reject(err);
	}
}

/**
 * @implements SecurityProvider
 */
module.exports = {
	hash: function (password) {
		return new Promise(function (resolve, reject) {
			bcrypt.hash(password, PROCESSING_ROUNDS, handler(resolve, reject));
		});
	},

	compare: function (password, encrypted) {
		return new Promise(function (resolve, reject) {
			bcrypt.compare(password, encrypted, handler(resolve, reject));
		});
	}
};
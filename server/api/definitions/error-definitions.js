'use strict';

var extend = require('extend');

var BASE = {user: null};

/**
 * Constants for API error types.
 */
module.exports = {
	MISSING_DATA: extend({}, BASE, {missingData: true}),
	DUPLICATED_USER: extend({}, BASE, {duplicatedUser: true}),
	NONEXISTENT_USER: extend({}, BASE, {nonexistentUser: true}),
	INVALID_PASSWORD: extend({}, BASE, {invalidPassword: true}),
	UNABLE_TO_DELETE: extend({}, BASE, {unableToDelete: true})
};
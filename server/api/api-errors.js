'use strict';

function ErrorClass(key) {
	this.user = null;
	this[key] = true;
}

module.exports = {
	isKnown: function (error) {
		return error instanceof ErrorClass;
	},

	MissingDataError: new ErrorClass('missingData'),
	DuplicatedUserError: new ErrorClass('duplicatedUser'),
	NonexistentUserError: new ErrorClass('nonexistentUser'),
	InvalidPasswordError: new ErrorClass('invalidPassword'),
	UnableToDeleteError: new ErrorClass('unableToDelete')
};

/*
 * If the errors would have needed to hold more information,
 * the errors would have been constructors inherited from ErrorClass instead,
 * and they would have had to be instantiated with 'new' before thrown.
 */
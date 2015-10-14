'use strict';

function UserError(key) {
	this.user = null;
	this[key] = true;
}

module.exports = {
	isKnown: function (error) {
		return error instanceof UserError;
	},

	MissingDataError: new UserError('missingData'),
	DuplicatedUserError: new UserError('duplicatedUser'),
	NonexistentUserError: new UserError('nonexistentUser'),
	InvalidPasswordError: new UserError('invalidPassword'),
	UnableToDeleteError: new UserError('unableToDelete')
};

/*
 * If the errors would have needed to hold more information,
 * the errors would have been constructors inherited from UserError instead,
 * and they would have had to be instantiated with 'new' before thrown.
 */
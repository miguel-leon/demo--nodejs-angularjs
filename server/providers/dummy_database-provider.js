'use strict';

var users = [
	{id: '6f4ad', email: 'a@a', password: '123', name: 'alan', last_name: 'brito'},
	{id: 'fs465', email: 'q@q', password: 'qwe', name: 'armando', last_name: 'mesa'}
];

var userModelWithoutPass = {
	id: '',
	email: '',
	name: '',
	last_name: ''
};

var userModelWithPass = {
	id: '',
	email: '',
	password: '',
	name: '',
	last_name: ''
};

/**
 * @private @method objectType. OBJECT TYPE CHECKING.
 * Must be used in the form objectType.call(obj).
 * @param  {Object} obj to be checked.
 * @return {string} Type of the object in the form '[object Typename]'. e.g. '[object Array]', '[object Object]'.
 */
var objectType = {}.toString;

function clone(obj) {
	if (null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

/**
 * Parameter order matters. Compare only the attributes in <a> against <b>
 * @returns {boolean}
 */
function compare(a, b) {
	if (objectType.call(a) != objectType.call(b)) return false;
	if (objectType.call(a) !== '[object Object]') return a === b;
	for (var attr in a) {
		if (a.hasOwnProperty(attr)) if (!compare(a[attr], b[attr])) return false;
	}
	return true;
}

function modelize(obj, model) {
	var out = {};
	for (var attr in model) {
		out[attr] = obj[attr];
	}
	return out;
}

function isComplete(user, model) {
	for (var attr in model) {
		if (attr === 'id') continue;
		if (!user[attr]) return false;
	}
	return true;
}

function copyModel(from, to, model) {
	for (var attr in model) {
		to[attr] = from[attr];
	}
	return to;
}

function makeid() {
	var POSSIBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var str = '';
	for (var i = 0; i < 5; ++i) {
		str += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));
	}
	return str;
}

function find(user, original) {
	if (objectType.call(user) === '[object Object]') {
		for(var i = 0; i < users.length; ++i) {
			if (compare(user, users[i])) {
				if (original) return users[i];
				user = clone(users[i]);
				delete user.password;
				return user;
			}
		}
	}
	return null;
}

module.exports = {
	Users: {
		list: function () {
			var copy = [];
			for (var i = 0; i < users.length; ++i) {
				copy[i] = clone(users[i]);
				delete copy[i].password;
			}
			return copy;
		},

		find: find,

		save: function (user) {
			if (!user.id) { // new user
				if (!isComplete(user, userModelWithPass)) throw { missingData: true };
				if (!!find({email: user.email})) throw { duplicatedUser: true };
				user.id = makeid();
				users.push(modelize(user, userModelWithPass));
				return modelize(user, userModelWithoutPass);
			}
			else { // existing user
				var prev = find({email: user.email}, true);
				if (!!prev) {
					if (prev.id != user.id) throw { duplicatedUser: true };
				}
				if (!prev) prev = find({id: user.id}, true);
				if (prev) {
					if (user.previous_password) {
						if (user.previous_password != prev.password) throw {invalidPassword: true};
						return modelize(copyModel(user, prev, userModelWithPass), userModelWithoutPass);
					}
					return copyModel(user, prev, userModelWithoutPass);
				}
				return null; // non existent user
			}
		},

		delete: function (user) {
			if (!user.id) return null;
			for (var i = 0; i < users.length; ++i) {
				if (user.id == users[i].id) return users.splice(i, 1);
			}
			return null;
		}
	}
};
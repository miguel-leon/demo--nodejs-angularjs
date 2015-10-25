'use strict';

// following variables must be set in the global scope at this point.
// var Sequelize;
// var sequelize;

var definitions = require('./definitions/sequelize-definitions');
var TYPES = definitions.TYPES;


  //==============================//
 //            MODELS            //
//==============================//
/**
 * @typedef Profile - Model Profile
 * @property {integer} id
 * @property {string} name
 */
var Profile = sequelize.define('profile', {
	id: TYPES.PRIMARY_KEY(),
	name: TYPES.NAME()
}, definitions.COMMON_OPTIONS);

/**
 * @typedef Holding - Model Holding
 * @property {integer} id
 * @property {string} name
 */
var Holding = sequelize.define('holding', {
	id: TYPES.PRIMARY_KEY(),
	name: TYPES.NAME()
}, definitions.COMMON_OPTIONS);

/**
 * @typedef User - Model User
 * @property {integer} id
 * @property {integer} profile_id
 * @property {integer} holding_id
 * @property {string} email
 * @property {string} password
 * @property {string} name
 * @property {string} last_name
 */
var User = sequelize.define('user', {
	id: TYPES.PRIMARY_KEY(),
	profile_id: TYPES.FOREIGN_KEY(Profile),
	holding_id: TYPES.FOREIGN_KEY(Holding),
	email: TYPES.EMAIL(),
	password: TYPES.PASSWORD(),
	name: TYPES.NAME(),
	last_name: TYPES.NAME()
}, definitions.COMMON_OPTIONS);


  //==============================//
 // RELATIONSHIPS / ASSOCIATIONS //
//==============================//
var forProfile = {foreignKey: 'profile_id', constraints: false};
var forHolding = {foreignKey: 'holding_id', constraints: false};

User.belongsTo(Profile, forProfile); // a User has one Profile
Profile.hasMany(User, forProfile); // a Profile belongs to many Users
User.belongsTo(Holding, forHolding); // a User has one Holding
Holding.hasMany(User, forHolding); // a Holding belongs to many Users
/*
 * Excerpt from Sequelize API documentation on naming of associations,
 * about e.g. "user belongs to profile": Conceptually, this might not make sense,
 * but since we want to add the foreign key to the user model this is the way to do it.
 */


  //==============================//
 //           EXPORTS            //
//==============================//
module.exports = {
	User: User,
	Profile: Profile,
	Holding: Holding
};

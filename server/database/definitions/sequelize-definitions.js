'use strict';

// following variables must be set in the global scope at this point.
// var Sequelize;

/**
 * Constants for option configurations and types.
 */
module.exports = {
	COMMON_OPTIONS: {
		freezeTableName: true, // the table name will not be pluralized
		timestamps: false
	},
	TYPES: {
		PRIMARY_KEY: function () {
			return {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			};
		},
		FOREIGN_KEY: function (model) {
			return {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {model: model}
			};
		},
		NAME: function () {
			return {
				type: Sequelize.STRING(45),
				allowNull: false
			};
		},
		EMAIL: function () {
			return {
				type: Sequelize.STRING(45),
					allowNull: false,
				unique: true
			};
		},
		PASSWORD: function () {
			return {
				type: Sequelize.STRING(255),
				allowNull: false
			};
		}
	}
};

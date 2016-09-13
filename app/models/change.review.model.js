"use strict";

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var Review = sequelize.define('review', {
  id: {
	  type: DataTypes.UUID,
	  defaultValue: DataTypes.UUIDV1,
	  primaryKey: true
  },
  description : {
      type: DataTypes.STRING
  },
  status : {
	  type: DataTypes.STRING
  }
  },{
    classMethods: {
          associate: function(models) {

            Review.belongsTo(models.change, {
              foreignKey: {
                allowNull: false
              }
            });
          }
        },
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'destroyTime',
  paranoid: true,
  freezeTableName: true // Model tableName will be the same as the model name);
      
});
    return Review;
  };
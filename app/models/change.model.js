"use strict";

var crypto = require('crypto');

module.exports = function(sequelize, DataTypes) {
  var Change = sequelize.define('change', {
  id: {
	  type: DataTypes.UUID,
	  defaultValue: DataTypes.UUIDV1,
	  primaryKey: true
  },
  section   : {
      type: DataTypes.ENUM,
	  allowNull: false, 
	  values: ['description', 'basics', 'address', 'photos', 'amenities', 'pricing', 'booking', 'calendar', 'status']
  },
  description : {
      type: DataTypes.STRING
  },
  reviewed : {
	  type: DataTypes.BOOLEAN,
      allowNull: false, 
      defaultValue: false
  }
  },{
    classMethods: {
          associate: function(models) {
            
            Change.belongsTo(models.property, {
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
    return Change;
  };
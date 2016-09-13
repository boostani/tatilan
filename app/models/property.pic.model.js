"use strict";


module.exports = function(sequelize, DataTypes) {
  var Picture = sequelize.define('picture', {
      id: {
          type: DataTypes.UUID,
		  defaultValue: DataTypes.UUIDV1,
	  	  primaryKey: true
      },
      description    : {
          type: DataTypes.STRING
      },
      isCover : {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      index: {
        type: DataTypes.STRING
      },
      active: {
         type: DataTypes.BOOLEAN,
         defaultValue: true 
      }
  },{
    classMethods: {
          associate: function(models) {
            Picture.belongsTo(models.property, {
              onDelete: "CASCADE",
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
  freezeTableName: true // Model tableName will be the same as the model name);)
  
  });
  return Picture;
}
                                  
"user restrict"

module.exports = function(sequalize, DataTypes){
    var Availability = sequalize.define('availability', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        startDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        available: {
          type: DataTypes.BOOLEAN
        },
        status: {
	      type: DataTypes.ENUM,
          values: ['open', 'reserved', 'on-hold']
        }
    },
    {
     classMethods: {
      associate: function(models) {
        Availability.belongsTo(models.property, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
           });
          Availability.belongsTo(models.reservation, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: true
            }
           });
      }
      },
      indexes: [
      // Create a unique index on email
      {
        fields: ['propertyId']
      }],
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'destroyTime',
      paranoid: true,
      freezeTableName: true // Model tableName will be the same as the model name
    });
    
    return Availability;
}
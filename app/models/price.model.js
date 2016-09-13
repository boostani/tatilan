"user restrict"

module.exports = function(sequalize, DataTypes){
    var Price = sequalize.define('price', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        price: {
           type: DataTypes.INTEGER 
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false
        },
        to: {
           type: DataTypes.DATE,
           allowNull: false
        }
    },{
      associate: function(models) {
        Price.belongsTo(models.property, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
           });
      },
      timestamps: true,
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
      deletedAt: 'destroyTime',
      paranoid: true,
      freezeTableName: true // Model tableName will be the same as the model name
    });
    
    return Price;
}
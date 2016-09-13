"user restrict"

module.exports = function(sequalize, DataTypes){
    var Homephoto = sequalize.define('homephoto', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        type: {
            type: DataTypes.STRING
        },
        descrip: {
            type: DataTypes.STRING
        },
        active: {
           type: DataTypes.BOOLEAN,
           defaultValue: true
        },
        isCover: {
           type: DataTypes.BOOLEAN,
           defaultValue: false
        },
        photoIndex: {
            type: DataTypes.INTEGER
        }
    },{
      associate: function(models) {
        Homephoto.belongsTo(models.property, {
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
    
    return Homephoto;
}
"user restrict"

module.exports = function(sequalize, DataTypes){
    var Reservation = sequalize.define('reservation', {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV1,
          primaryKey: true
        },
        from: {
            type: DataTypes.DATE,
            allowNull: false
        },
        to: {
           type: DataTypes.DATE,
           allowNull: false
        },
        guests: {
           type: DataTypes.INTEGER  
        },
        totalAsked: {
           type: DataTypes.INTEGER 
        },
        totalPaid: {
           type: DataTypes.INTEGER 
        },
        paymentToOwner: {
            type: DataTypes.INTEGER 
        },
        payDay: {
            type: DataTypes.DATE 
        },
        refund: {
           type: DataTypes.INTEGER  
        },
        refundDay: {
           type: DataTypes.DATE  
        },
        
    },{
      classMethods: {
          associate: function(models) {
            Reservation.belongsTo(models.property, {
                onDelete: "CASCADE",
                foreignKey: {
                    allowNull: false
                }
               });
            Reservation.belongsTo(models.user, {
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
      freezeTableName: true // Model tableName will be the same as the model name
    });
    
    return Reservation;
}
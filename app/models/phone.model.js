"use strict";
   var sms		= require('sms');
    
module.exports = function(sequelize, DataTypes) {
   var Phone = sequelize.define('phone', {
      id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
       areaCode: {
          type: DataTypes.INTEGER 
       },
       phoneNumber: {
           type: DataTypes.BIGINT
       },
       fullNumber: {
          type: DataTypes.BIGINT,
          unique: true
       },
       verified: {
           type: DataTypes.BOOLEAN,
           defaultValue: false
       },
       verificationCode: {
            type: DataTypes.INTEGER   
       },
       verificationAttempts: {
           type: DataTypes.INTEGER,
           defaultValue: 0
       }
   },
      {
       classMethods: {
          associate: function(models) {
            Phone.belongsTo(models.user, {
              foreignKey: {
                allowNull: false
              }
            });
          }
        },
       hooks: {
          beforeCreate : function(user, options){

              var validationCode = Math.floor(1000 + Math.random() * 9000);
              user.verificationCode = validationCode;
              
              user.fullNumber = user.areaCode+user.phoneNumber;


          }/*,
          afterCreate : function(phone){
	          
	          sms.send({ message : phone.verificationCode +' '+ 'کد اثبات مالکیت تلفن همراه شما در پروفایل تعطیلان است. ', sender : '10000111010111' , 
		        //to : req.body.data.to 
		        to: phone.fullNumber
		       } ,function(send ,data){
				
        		console.log(data);

    		  });
	          
          }*/
        },
       instanceMethods: {
            toJSON: function () {
              var values = this.get();

              return values;
            }
          },
        imestamps: true,
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
        deletedAt: 'destroyTime',
        freezeTableName: true // Model tableName will be the same as the model name
      });  

  return Phone;
}
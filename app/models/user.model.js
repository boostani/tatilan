"use strict";

var crypto = require('crypto'),
    passportLocalSequelize = require('passport-local-sequelize'),
    crypto          = require('crypto'),
    jwt             = require('jsonwebtoken'),
    config          = require('../../config/config');

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
   id: {
	  type: DataTypes.UUID,
	  defaultValue: DataTypes.UUIDV1,
	  primaryKey: true
  },
  firstName   : {
      type: DataTypes.STRING,
      allowNull: false
  },
  lastName    : {
      type: DataTypes.STRING,
      allowNull: false
  },
  password    : {
      type: DataTypes.STRING
  },
  username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
  },
  emailVerified: {
	 type: DataTypes.BOOLEAN,
	 defaultValue: false 
  },
  verifiedUser: {
	 type: DataTypes.BOOLEAN,
	 defaultValue: false 
  },
  verificationType: {
	 type: DataTypes.STRING 
  },
  salt        : {
      type: DataTypes.STRING
  },
  dob: {
      type: DataTypes.DATE  
  },
  profileCompleted : {
      type: DataTypes.BOOLEAN
  },
  pictureUploaded : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  },
  hasProperty : {
      type: DataTypes.BOOLEAN,
      defaultValue: false
  },
  gender : {
      type: DataTypes.ENUM('Male', 'Female', 'Other')  
  },
  description: {
      type: DataTypes.STRING(400)
  },
  school : {
      type: DataTypes.STRING  
  },
  work : {
      type: DataTypes.STRING  
  },
  address : {
      type: DataTypes.STRING  
  },
  invitedby   : {
      type: DataTypes.UUID
  },
  createdBy   : {
      type: DataTypes.INTEGER
  }
}, {
  classMethods: {
    associate: function(models) {
        
        User.hasMany(models.phone, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        });
        
        User.hasMany(models.review, {
            foreignKey: {
                allowNull: false
            }
        });
        
        
    }
  },
  hooks: {
      beforeCreate : function(user, options){
          
          var saltVal = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64').toString();
          user.salt = saltVal;
          var cryptoPass = crypto.pbkdf2Sync(user.password, saltVal, 10000, 64).toString('base64');
          user.password = cryptoPass;
          return user;
               
      }
  },
  instanceMethods: {
    toJSON: function () {
      var values = this.get();
     
        // create the authentication token
                
        var hashUser = {};
        hashUser.id = values.id;
        hashUser.username = values.username;
        hashUser.password = values.password;
        hashUser.firstName = values.firstName;
        hashUser.lastName = values.lastName;
        values.token = jwt.sign(hashUser, config.sessionSecret,{
                    expiresIn:14400000
         });
      //delete values.id;
      //delete values.profileCompleted;
      delete values.gender;
      //delete values.hasProperty;
      delete values.address;
      delete values.invitedby;
      delete values.work;
      delete values.salt;
      delete values.password;
      return values;
    }
  },
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'destroyTime',
  paranoid: true,
  freezeTableName: true // Model tableName will be the same as the model name
});
    
 passportLocalSequelize.attachToUser(User, {
	usernameField: 'username',
	hashField: 'password',
	saltField: 'salt'
});
      
  return User;
};


"use strict";

var crypto = require('crypto'),
    models          = require('../models'),
    Status          = models.status,
    Availability	= models.availability,
    sequelize       = require('sequelize');
    

module.exports = function(sequelize, DataTypes) {
  var Property = sequelize.define('property', {
  id: {
	  type: DataTypes.UUID,
	  defaultValue: DataTypes.UUIDV1,
	  primaryKey: true
  },
  title   : {
      type: DataTypes.STRING
  },
  description    : {
      type: DataTypes.STRING
  },
  status : {
    type: DataTypes.ENUM,
    allowNull: false, 
    defaultValue: 'open',
    values: ['open', 'close', 'on-hold']
  },
  listingCompleted : {
	type: DataTypes.BOOLEAN,
    defaultValue: false 
  },
  capacity : {
    type: DataTypes.INTEGER  
  },
  rentType: {
    type: DataTypes.STRING  
  },
  propertyType: {
    type: DataTypes.STRING 
  },
  rooms : {
    type: DataTypes.INTEGER
  },
  bath : {
    type: DataTypes.INTEGER
  },
  restroom: {
	type: DataTypes.INTEGER  
  },
  fullBed: {
    type: DataTypes.INTEGER 
  },
  singleBed:{
    type: DataTypes.INTEGER 
  },
  mattress : {
	 type: DataTypes.INTEGER 
  },
  homeInstruction: {
    type: DataTypes.STRING
  },
  wifiName: {
     type: DataTypes.STRING 
  },
  wifiPassword: {
    type: DataTypes.STRING 
  },
  address: {
     type:  DataTypes.STRING 
  },
  region: {
     type:  DataTypes.STRING 
  },
  city: {
    type:  DataTypes.STRING(50)  
  },
  state: {
     type:  DataTypes.STRING(50)
  },
  postalCode: {
     type:  DataTypes.STRING(15) 
  },
  direction: {
     type:  DataTypes.STRING 
      
  },
  lat: {
     type:  DataTypes.DOUBLE  
  },
  lng: {
     type:  DataTypes.DOUBLE 
  },
  basePrice: {
     type:  DataTypes.INTEGER  
  },
  weekendPrice: {
	type:  DataTypes.INTEGER  
  },
  weeklyDiscount: {
      type:  DataTypes.INTEGER
  },
  monthlyDiscount: {
      type:  DataTypes.INTEGER
  },
  cleaningFee: {
	  type:  DataTypes.INTEGER
  },
  securityDeposit: {
	  type:  DataTypes.INTEGER
  },
  cancelation : {
    type: DataTypes.ENUM,
    defaultValue: 'moderate',
    values: ['moderate', 'restrict', 'very restrict']
  },
  frequentRenter: {
      type: DataTypes.BOOLEAN,
      defaultValue: true 
  },
  reviewed: {
     type: DataTypes.BOOLEAN,
     defaultValue: false  
  },
  reviewedAt: {
     type: DataTypes.DATE    
  },
  listedBy: {
      type:  DataTypes.STRING 
  },
  breakfast: {
	  type: DataTypes.BOOLEAN
  },
  tv: {
    type: DataTypes.BOOLEAN  
  },
  cableTv: {
    type: DataTypes.BOOLEAN  
  },
  cookingTools: {
    type: DataTypes.BOOLEAN   
  },
  dishes: {
     type: DataTypes.BOOLEAN  
  },
  kitchen : {
     type: DataTypes.BOOLEAN 
  },
  coolingSystem: {
     type: DataTypes.BOOLEAN 
  },
  fan: {
	type: DataTypes.BOOLEAN  
  },
  waterAirCondition: {
	type: DataTypes.BOOLEAN   
  },
  gasAirCondition: {
	type: DataTypes.BOOLEAN  
  },
  sportEntertainment : {
	 type: DataTypes.BOOLEAN 
  },
  bedding: {
	 type: DataTypes.BOOLEAN 
  },
  heatingSystem: {
     type: DataTypes.BOOLEAN
  },
  internet: {
    type: DataTypes.BOOLEAN
  },
  allDayCheckIn: {
     type: DataTypes.BOOLEAN 
  },
  washer: {
     type: DataTypes.BOOLEAN
  },
  bbq: {
     type: DataTypes.BOOLEAN 
  },
  shampoo: {
     type: DataTypes.BOOLEAN 
  },
  blowDryer: {
     type: DataTypes.BOOLEAN 
  },
  hottub: {
     type: DataTypes.BOOLEAN 
  },
  pool: {
    type: DataTypes.BOOLEAN  
  },
  fireplace: {
    type: DataTypes.BOOLEAN 
  },
  iron: {
    type: DataTypes.BOOLEAN
  },
  hangers: {
    type: DataTypes.BOOLEAN
  },
  parking: {
    type: DataTypes.BOOLEAN  
  },
  goodForEvents: {
      type: DataTypes.BOOLEAN
  },
  petAllowed: {
      type: DataTypes.BOOLEAN
  },
  smockingAllowed: {
      type: DataTypes.BOOLEAN
  },
  wheelchaireAccessible: {
      type: DataTypes.BOOLEAN
  }
 
},{
    classMethods: {
          associate: function(models) {
            Property.belongsTo(models.user, {
              onDelete: "CASCADE",
              foreignKey: {
                allowNull: false
              }
            });
            Property.hasMany(models.picture, {
                onDelete: "CASCADE",
                foreignKey: {
                    allowNull: false
               }
            });
            
            Property.belongsTo(models.user, {
	            as: "manager",
	            foreignKey: {
                    allowNull: true
               }
            });
            
            Property.hasMany(models.change, {
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
  freezeTableName: true // Model tableName will be the same as the model name);
      
});
    return Property;
  };
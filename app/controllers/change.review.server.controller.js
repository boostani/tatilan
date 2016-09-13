// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    crypto          = require('crypto'),
    models          = require('../models'),
    User            = models.user,
    Property        = models.property,
    Change			= models.change,
    sequelize       = require('sequelize');


exports.log = function(req, res){
  
   
	 if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
    
    async.waterfall([
        function(callback){
            // ----------------------
            // validate token
            // ----------------------
            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
            
            if (err){

                callback({error:'invalid token'}); 
            }else{
               callback(null, decoded); 
            }
            });
        }, function(decoded, callback){
	        
	        Change.findOrCreate({where:{propertyId:req.body.data.propertyId, section: req.body.data.section, reviewed:false}})
           		.then(function(data){
	           		
	           		callback(null, data)
	           		
           		}, function(err){
	           		
	           		callback(err);
           		});
            
		}], function(err, result){
			
			if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
			
		});
      
}
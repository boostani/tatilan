// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
	async           = require('async'),
    config          = require('../../config/config'),
    sms				= require('sms'),
    crypto          = require('crypto'),
    models		    = require('../models'),
    User            = models.user,
    Phone           = models.phone,
    sequelize       = require('sequelize');
    
    
exports.resendCode = function(req, res){
	
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
        },
        function(result, callback){
	        
	        Phone.findOne({where:
		        {userId:result.id, fullNumber: req.body.data.to}
		        //{userId:1 , fullNumber: 1111111111}
		         
		        })
	        	 .then(function(data){
		        	 
		        	 callback(null, data);
		        	 
	        	 }, function(err){
		        	 
		        	 callback(err);
		        	 
	        	 })
	        
        },
        function(result, callback){
	        
	        sms.send({ message : result.verificationCode +' '+ 'کد اثبات مالکیت تلفن همراه شما در پروفایل تعطیلان است. ', sender : '10000111010111' , 
		        to : req.body.data.to 
		        //to: '09125702094'
		       } ,function(send ,data){
				
        		console.log(data);
        		if(data && data.return.status == 200){
	        		callback(null, data)
        		}else {
	        		callback(null, data)
        		}
    		});
	        
        }
		
	], function(err, result){
		if(err){
            res.status(500).json({ err: err});
        }else{
            res.json(result);
        }

	})
	
}
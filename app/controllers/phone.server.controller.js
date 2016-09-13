// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    crypto          = require('crypto'),
    config          = require('../../config/config'),
    models          = require('../models'),
    User            = models.user,
    Phone           = models.phone,
    sequelize       = require('sequelize');


exports.add = function(req, res){
    
    // ----------------------
    // accepts {data, token}
    // ----------------------
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
            
            // ----------------------
            // add Phone Number
            // ----------------------
            var phoneNumber = req.body.data;
            phoneNumber.userId = decoded.id;
            
            Phone.create(phoneNumber).then(
               function(result){
                   var resultObj = {
                       id: result.id,
                       phoneNumber: result.phoneNumber,
                       areaCode: result.areaCode,
                       verified: false
                   }
                    callback(null, resultObj);
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



exports.verify = function(req, res){
     // ----------------------
    // accepts {data, token}
    // ----------------------
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
        },function(decoded, callback){
            
            Phone.findOne({where:{phoneNumber: req.body.data.phoneNumber, areaCode: req.body.data.areaCode, userId: decoded.id}})
                 .then(function(result){
                    if(result){
                        callback(null, result.dataValues);
                    }
                }, function(err){
                    callback(err);
                });
            
        },function(foundPhone, callback){  
	        console.log(foundPhone);      
            // ----------------------------------
            // check if verification code matches
            // ----------------------------------
            if(foundPhone.verificationCode == req.body.data.verificationCode){
                
                Phone.update({verified: true, verificationAttempts: sequelize.literal('"verificationAttempts" +1')}, 
                         {where:{id: foundPhone.id}})
                .then(
                function(result){
                    callback(null, {success: true});
                }, function(err){
                    callback(err);
                });
                
            }else{
                // ----------------------------------
                // Increment attempts for no match
                // ----------------------------------
                if(foundPhone.verificationAttempts <10){
                    Phone.update({verificationAttempts: sequelize.literal('"verificationAttempts" +1')}, 
                         {where:{id: foundPhone.id}})
                            .then(
                            function(result){
                                callback(null, {success: false});
                            }, function(err){
                                callback(err);
                            });
                }else{
                    Phone.destroy({where:{id: foundPhone.id}})
                        .then(
                            function(result){
                                callback(null, {success: null, securityReset: true });
                            }, function(err){
                                callback(err);
                            });
                }
            }
            
            
        }
            
        ], function(err, result){
         
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
     });  
    

}

exports.isUnique = function(req, res){
    
    Phone.findAndCountAll({where:req.body})
         .then(function(result){

            if(result.count>0){
                res.json({unique: false})
            }else{
                res.json({unique: true})
            }
        }, function(err){
            res.status(500).json({ err: err});
        })
}

exports.remove = function(req, res){
    
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
            
        },function(decoded, callback){
            
            Phone.destroy({where:{id: req.body.data.id, userId: decoded.id}})
                 .then(function(result){
                    if(result){
                        callback(null, result.dataValues);
                    }
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
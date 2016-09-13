// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    crypto          = require('crypto'),
    models          = require('../models'),
    User            = models.user,
    Phone           = models.phone,
    sequelize       = require('sequelize');


exports.getPage = function(req, res){
    

}

exports.getData = function(req, res){
     jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
         if (err || !req.user){
              res.status(401).send({error:'You are not logged in or the token is expired.'}); 
         }else{
             User.find({where:{id: decoded.id}, include:[{model:Phone, attributes:['id', 'areaCode', 'phoneNumber', 'verified']}]}).then(function(result){
                 res.json(result);
             }, function(err){
                 res.status(401).send(err);
             });
         }
     });
}
                

exports.update = function(req, res){
    
    
};

exports.changePassword = function(req, res){
    

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
            
            // ----------------------
            // get user from db
            // ----------------------
            
            User.findOne({where:{id: decoded.id}})
                .then(function(foundUser){
                    callback(null, foundUser.dataValues)
                }, function(err){
                    callback(err);
                });
            
            
        }, function(foundUser, callback){
            
            var hashpassword = crypto.pbkdf2Sync(req.body.data.password, foundUser.salt, 10000, 64).toString('base64');
            
            if(hashpassword == foundUser.password){
                var newPassword = crypto.pbkdf2Sync(req.body.data.newPassword, foundUser.salt, 10000, 64).toString('base64');
                User.update({password:newPassword}, {where:{id: foundUser.id}})
                    .then(function(update){
                        callback(null, update);
                    }, function(err){
                        callback(err);
                    });
                
            }else{
                callback({error: "Wrong Password"})
            }
        }], function(err, result){
         
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
     }); 
}
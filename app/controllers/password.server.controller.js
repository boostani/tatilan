// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    crypto          = require('crypto'),
    models          = require('../models'),
    User            = models.user,
    Phone           = models.phone,
    sequelize       = require('sequelize'),
    SparkPost 		= require('sparkpost'),
	sparky 			= new SparkPost(config.sparkPost);


exports.forgotPage = function(req, res){
    
	jwt.verify(req.params.token, config.sessionSecret, function(err, decoded) {
         
 
        if (err){
	        
			res.render('passwordReset', {error: err, user: '', token: ''});
        
        }else{
            
           res.render('passwordReset', {user: '', token: decoded});
        }
    });
}

exports.forgot = function(req, res){
	
	async.waterfall([
		
		//---------------------------
		// Find user by email
		// --------------------------
		function(callback){
			
	        User.find({where:{username: req.body.email}})
	        	.then(function(result){
		        	console.log(result);
		        	if(result){
			        	
		        		callback(null, result.dataValues);
		        		
		        	}else{
			        	callback({error: 'no email match'});
		        	}
	        	}, function(err){
		        	callback(err)
	        	})
	        
	    }, 
	    //---------------------------
		// create the rest link
		// --------------------------
		function(result, callback){
			console.log(result);
			
		    var hashUser = {};
	        hashUser.id = result.id;
	        hashUser.email = result.username;
	        var token = jwt.sign(hashUser, config.sessionSecret,{
	                    expiresIn:1400000
	        });
	        
	        var resetLink = 'tatilan.com/resetpassword/'+token+'?redirect=/';
	        callback(null, {link: resetLink, user: result});
		    
	    },
	    function(result, callback){
		    
		   sparky.transmissions.send({
			  transmissionBody: {
			    content: {/*
			      from: 'hello@tatilan.com',
			      subject: 'Oh hey!',
			      html:'<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'*/
			      template_id: 'reset-password'
			    },
			     substitution_data: {
				      name: result.user.firstName,
				      resetLink: result.link
				},
			    recipients: [
			      {address: result.user.username}
			    ]
			  }
			}, function(err, res) {
			  if (err) {
			    console.log('Whoops! Something went wrong');
			    callback(err);
			  } else {
			    callback(null, res);
			  }
			});
		    
		    
	    }], function(err, result){
	        
	        if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }

        });
	
}

exports.reset = function(req, res){
	
	User.find({where: {id: req.body.id}})
		.then(function(result){
			console.log(result);
			var newPassword = crypto.pbkdf2Sync(req.body.password, result.salt, 10000, 64).toString('base64');
			
			User.update({password:newPassword}, {where:{id: req.body.id}, returning: true})
		         .then(function(update){
			         
		             res.json(result);
		             
		         }, function(err){
			         
		             res.status(500).json({ err: err});
		         });
			
		}, function(err){
			
			res.status(500).json({ err: err});
			
		})
	
	

	
}
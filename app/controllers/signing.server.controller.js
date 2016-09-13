// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    sms				= require('sms'),
    crypto          = require('crypto'),
    models          = require('../models'),
    User            = models.user,
    Phone           = models.phone,
    sequelize       = require('sequelize'),
    SparkPost 		= require('sparkpost'),
	sparky 			= new SparkPost(config.sparkPost);
	

  
    /*ses = require('node-ses'), 
    client = ses.createClient({ key: config.AWSAccessKey, secret: config.AWSSecretKey });*/
    

    /*nodemailer 		= require('nodemailer'),
    ses				= require('nodemailer-ses-transport'),
    transporter 	= nodemailer.createTransport(ses({
    	accessKeyId: config.AWSAccessKey,
		secretAccessKey: config.AWSSecretKey
	}));*/



exports.createUser = function(req, res, next){
    var userObj = models.users;
    userObj = req.body;
    /*userObj.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64').toString();
    var cryptoPass = crypto.pbkdf2Sync(req.body.Password, userObj.salt, 10000, 64).toString('base64');
    userObj.password = cryptoPass;*/
    userObj.profileCompleted = false;
    
    // =============================================
    // 1. Create the user
    // =============================================
    
    async.waterfall([
      function(callback) {
         User.create(userObj)
             .then(function(user){
               console.log(user.dataValues.id);
                callback(null, user.dataValues); 
            }, function(err){
              callback(err); 
         });
      },
      function(result, callback) {
         
        Phone.create({
            phoneNumber: req.body.phoneNumber, 
            areaCode: req.body.areaCode,
            userId: result.id})
             .then(function(phone){
                var savedUser = {
                   user: result,
                   phone: phone.dataValues
                };
                
               callback(null, savedUser);  
                
            },function(err){
            
                callback(err); 
            
            });
      },
      function(result, callback){
	
	      sparky.transmissions.send({
			  transmissionBody: {
			    content: {/*
			      from: 'hello@tatilan.com',
			      subject: 'Oh hey!',
			      html:'<html><body><p>Testing SparkPost - the world\'s most awesomest email service!</p></body></html>'*/
			      template_id: 'welcome'
			    },
			     substitution_data: {
				      name: result.user.firstName
				},
			    recipients: [
			      {
				      //address: 'aboostani@yahoo.com'
				      address: result.user.username
				  }
			    ]
			  }
			}, function(err, res) {
			  if (err) {
			    // console.log('Whoops! Something went wrong');
			    callback(err);
			  } else {
			    callback(null, result);
			  }
			});
	      
      }
    ], function(err, results) {

        if(err) res.status(500).json({ err: err});
        passport.authenticate('local')(req, res, function () {
	        
	        	var values = results.user;
                    var hashUser = {};
			        hashUser.id = values.id;
			        hashUser.username = values.username;
			        hashUser.password = values.password;
			        hashUser.firstName = values.firstName;
			        hashUser.lastName = values.lastName;
			        values.token = jwt.sign(hashUser, config.sessionSecret,{
			                    expiresIn:14400000
			         });
                    values.phone = results.phone;
            
                    
                    values.password = '';
                    /*values.phoneNumber = req.body.phoneNumber;
                    values.areaCode    = req.body.areaCode;*/
			         
			         
			         
                  return res.status(200).json({
                    success: true,     
                    user: values
                  });
        }); 
         
        //var user = results.user;
        //var tasks = results.tasks;
        // do things with the results
    });
  
};

// =============================================
// Check if email is unique
// =============================================

exports.checkEmail = function(req, res, next){
  
    User.findAndCountAll({where :req.body})
        .then(function(result){
            if(result.count>0){
                res.json({unique: false})
            }else{
                res.json({unique: true})
            }
        },function(err){
            res.status(401).send(err);
        });
};

// =============================================
// Check if phone is unique
// =============================================

exports.checkPhone = function(req, res, next){
    
    Phone.findAndCountAll({where :{$and: [{phoneNumber:req.body.phoneNumber},{areaCode: req.body.areaCode}]}})
        .then(function(result){
            res.json(result);
        },function(err){
            res.status(401).send(err);
        });
};


/*exports.register = function(req, res) {
    User.create(req.body)
        .then(function(user){
              passport.authenticate('local')(req, res, function () {
                  return res.status(200).json({
                    status: 'Registration successful!'
                  });
                }); 
        }, function(err){
             return res.status(500).json({
                err: err
            });
         });
      
        
};*/

exports.login = function(req, res, next){
	
	/*var options = {
    template_id: 'reset-password'
  };
  var reqOpts = {
  transmissionBody: {
    campaignId: 'ricks-campaign',
    content: {
      template_id: 'ricks-template'
    },
    'num_rcpt_errors': 3,
    recipients: [{ address: { email: 'rick.sanchez@rickandmorty100years.com', name: 'Rick Sanchez' } }]
  }
};*/
	
	/*sms.send({ message : 'پیامک فارسی' , sender : '10004346' , to : '09125702094' } ,function(send ,status){
        console.log(send);
        console.log(status);
    });*/


   passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
	  
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
	
      res.status(200).json(user);
    });
  })(req, res, next);
   
};
    

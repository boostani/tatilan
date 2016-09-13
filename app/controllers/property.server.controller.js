// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    crypto          = require('crypto'),
    models          = require('../models'),
    moment          = require('moment'),
    User            = models.user,
    Property        = models.property,
    Change			= models.change,
    Picture         = models.picture,
    Availability    = models.availability,
    sequelize       = require('sequelize');


exports.newListing = function(req, res){
  
   
    if(req.user){
        res.render('listing', {user:req.user, property: {}});
    } else {
        res.redirect('/');
    }
      
}

exports.updateListing = function(req, res){
  
    if(req.user){
        Property.findOne({
	        
	        where:{id:req.params.id},  
        	include: [
        		{ model: Picture, required: false}, 
        		{ model: Change, attributes: ['section'], required: false, where: {reviewed: false}}
        	]})
            .then(function(result){
	            //console.log(result);
	            //res.json(result);
	            if(result == null){
		          res.redirect('/property');  
	            }else{
		            if(typeof result.pictures == 'undefined'){
			            result.pictures = [];
			        }
                	res.render('listing', {user:req.user, property:result});
                }
            }, function(err){
                res.status(401).send({error:"page not found"}); 
        });
        
        
    } else {
        res.redirect('/?redirect=/property/'+req.params.id);
    }
      
}

exports.details = function(req, res){

    var property = {};
    var checkinDate = req.query.checkin;//.replace('%', '-');
    var checkoutDate = req.query.checkout;//.replace('%', '-');
    var a = moment(checkinDate);
    var b = moment(checkoutDate);
    var numDays = b.diff(a, 'days')-1;
    property.search =  {
        id: req.params.propertyId,
        checkIn: checkinDate,
        checkOut: checkoutDate,
        numDays: numDays
    };
    if(typeof req.user != 'undefined'){
        property.user = req.user;
    }else{
        property.user = "";
    }
    
  
    Property.findOne({where:{id:property.search.id}, include: [{model:User, attributes:['firstName', 'lastName', 'id', 'pictureUploaded', 'username', 'description']}, {model:Picture, where:{active:true}}]})
        .then(function(result){

            property.details = result;


            if(property.search.checkIn && property.search.checkOut){

              Availability.findAll(
                {where:{propertyId: property.search.id, available: false, $and:[{date:{$gte: property.search.checkIn}}, {date:{$lt:property.search.checkOut}}]}}).then(
                function(occupied){
                    //console.log(occupied);

                    if(occupied){
                        property.available = false
                    }else{
                        property.available = true;
                    }
                    res.render('property', property);

                }, function(err){
                    console.log(err);
                    property.available = "Can't be found!"
                    res.render('property', property);
                });

            }else{
                property.available = "";
                res.render('property', property);
            }
           // console.log(property);
            
      
        }, function(err){
                res.status(401).send({error:"page not found"}); 
        });
        
    
  
};

exports.add = function(req, res){
    
    var userInfo;
    var passedObj = req.body.updates;
    
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
            
            // ----------------------
            // create property
            // ----------------------            
            passedObj.userId = decoded.id;
        
            Property.create(passedObj)
                    .then(function(result){
					
                        callback(null, result.dataValues);

                   }, function(err){
                        callback(err);        
            });
        },function(result, callback){
	        
	        var date = new Date(); 
		    var month = date.getMonth();
		    var day = date.getDate();
		    var year = date.getFullYear();
		    
		    var today = new Date(year, month, day);
		    var endTime = new Date(year+5, month, day);

			Availability.create({propertyId: result.id, startDate:today, endDate:endTime , userId: result.userId})
				.then(function(data){
					callback(null, result);
				}, function(err){
					callback(err);
				});
	        
	    },function(result, callback){
		
			Change.create({propertyId: result.id, section: 'description'}).then(
				function(data){
					callback(null, result);
				}, function(err){
					callback(err);
				}
			)
		
		}, function(result, callback){
            
            // --------------------------
            // set user as property owner
            // --------------------------
            if(req.user.hasProperty == false){
                User.update({hasProperty: true},{where:{id:req.user.id}}).then(
                    function(user){
                        callback(null, result);
                    }, function(err){
                        callback(err);
                    });
            }else{
                callback(null, result);   
            }
            
        }], function(err, result){
	        
        	if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
    });
    
         
        
    };
    
       

exports.update = function(req, res, next){
    
    var decodedObj = {};
    console.log(req.body);
    
    
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
	        
            // ----------------------
            // create the update
            // ----------------------    
    
	        Property.update(
	          req.body.updates,
	          {where: {id : req.params.id}, returning: true})
	           .then(function(result){
	               
	               callback(null, result);
	               
	            }, function(err){
		            
	               callback(err);       
	        });
	        
	   }, function(result, callback){
	   
            // ---------------------------
            // mark content for review
            // ---------------------------
            
           Change.findOrCreate({where:{propertyId:req.params.id, section: req.body.section, reviewed:false}})
           		.then(function(data){
	           		
	           		callback(null, result)
	           		
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
    
   /* jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
            
        if (err){
            console.log('getting error');
            return res.status(401).send({error:'invalid token'}); 
        };


        console.log(req.body.id);
        console.log(decoded.id);
        decodedObj = decoded;
        
    });*/
    
    
    
}
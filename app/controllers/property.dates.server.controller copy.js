// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    crypto          = require('crypto'),
    models          = require('../models'),
    moment			= require('moment'),
    User            = models.user,
    Phone           = models.phone,
    Property        = models.property,
    Availability    = models.availability,
    Reservation     = models.reservation,
    sequelize       = require('sequelize'),
    moment          = require('moment');



exports.getAvailability = function(req, res){
    
    async.parallel({
        unavailable: function(callback){

            Availability.findAll({where: {$and: [{propertyId: req.params.propertyId}, {available: false}, {reservationId: {$eq: null}}, {date:{$gte: moment().format('YYYY-MM-DD')}}]}, attributes: ['date']})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });

        },
        reserved: function(callback){
            Availability.findAll({where: {$and: [{propertyId: req.params.propertyId}, {reservationId: {$ne: null}}, {date:{$gte: moment().format('YYYY-MM-DD')}}]}, attributes: ['date']})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
        },
        available: function(callback){
            Availability.findAll({where: {$and: [{propertyId: req.params.propertyId}, {available: true}, {reservationId: {$eq: null}}, {date:{$gte: moment().format('YYYY-MM-DD')}}]}, attributes: ['date']})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
        }


        },
        function(err, result){
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }

        });
    
};

// ------------------------------------------------------------
// date update for properties that aren't frequently available
// object : 
// { token, 
//   action: [add, remove], 
//   availability :{date, propertyId}
// }
// ------------------------------------------------------------

exports.update = function(req, res){
    
    var userInfo;
    
    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
            
        if (err){
            
            return res.status(401).send({error:'invalid token'}); 
        };
        
        userInfo = decoded; 
        
    });
    
    if(req.body.action == 'add'){
        
        Availability.update({available: true},{where: req.body.availability}).then(function(result){
            res.json(result);
        }, function(err){
            res.status(401).send({error:'Something went wrong. We could not add the new availability.'}); 
        });
    }else if(req.body.action == 'remove') {
        Availability.update({available: false}, {where: req.body.availability}).then(
        function(result){
            res.json(result);
        }, function(err){
             res.status(401).send({error:'Something went wrong. We could not add the new availability.'});                                                     
        });
    }else{
        
        res.status(401).send({error:'Action was not explained correctly.'}); 
    }
    
    
};

// ------------------------------------------------------------
// Make date available
// ------------------------------------------------------------
exports.setUnavailable = function(req, res){

    
    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
            
        if (err){
            
            return res.status(401).send({error:'invalid token'}); 
        };
        })
  }
        

// ------------------------------------------------------------
// update unavailable dates from property calendar
// object : 
// { token, 
//   action: [add, remove], 
//   availability :{fromDate, toDate, propertyId}
// }
// ------------------------------------------------------------


exports.makeUnavailable = function(req, res){

    
    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
            
        if (err){
            
            return res.status(401).send({error:'invalid token'}); 
        };
        

        
    
        //req.body.availability.userId = decoded.id;
        //req.body.availability.guests = 0;

        req.body.availability.date = moment(req.body.availability.date).startOf('day').format('YYYY/MM/DD');
        console.log(req.body.availability.date);

        if(req.body.action == 'add'){

            Availability.findOrCreate({where: req.body.availability}).spread(function(result, created){
                console.log(created);
                res.json(result);
            }, function(err){
                res.status(401).send({error:'Something went wrong. We could not add the new availability.'}); 
            });
        }else if(req.body.action == 'remove') {
            Availability.destroy({where: req.body.availability}).then(
            function(result){
                res.json(result);
            }, function(err){
                 res.status(401).send({error:'Something went wrong. We could not add the new availability.'});                                                     
            });
        }else{

            res.status(401).send({error:'Action was not explained correctly.'}); 
        }
    });
}

exports.madeUnavailable = function(req, res){
     Reservation.findAll({where: { $and : [{propertyId: req.params.propertyId}, {guests: 0}]}, attributes: ['from']})
        .then(function(result){
            res.json(result);
        }, function(err){
            res.status(401).send(err);
        });
}

// -----------------------------------------------
// bulk create dates
// -----------------------------------------------

exports.setInfrequent = function(req, res){
	
	if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
    
    async.waterfall([
        function(callback){
            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
                  console.log(err);
                  callback(err, decoded);
              });
        },function(result, callback){
            
            // --------------------------------------
            // set the property to infrequent renter
            // --------------------------------------            
            Property.update({frequentRenter: false}, {where:{id: req.body.propertyId}})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
                
        },function(result, callback){
            
            // -----------------------------------
            // remove the existing records
            // -----------------------------------
             
			Availability.destroy({where:{propertyId: req.body.propertyId, available: 1}}).then(
	            function(removed){
	                callback(null, removed); 
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

exports.setFrequent = function(req, res){
	
	if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
    
    async.waterfall([
        function(callback){
            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
                  console.log(err);
                  callback(err, decoded);
              });
        },function(result, callback){
            
            // --------------------------------------
            // set the property to infrequent renter
            // --------------------------------------            
            Property.update({frequentRenter: true}, {where:{id: req.body.propertyId}})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
                
        },function(result, callback){
	        
	        // --------------------------------------
            // Remove single availabilities
            // -------------------------------------- 
             
			Availability.destroy({where:{propertyId: req.body.propertyId, available: 1}}).then(
	            function(removed){
	                callback(null, removed); 
	            }, function(err){
	                callback(err);
	            });  
	    
	    }, function(result, callback){
		    
		    var date = new Date(); 
		    var month = date.getMonth();
		    var day = date.getDate();
		    var year = date.getFullYear();

		    // or, if you need a date object without the time
		   // return new Date(date.getFullYear(),date.getMonth(),date.getDate());
		    
		    //var today = moment(req.body.availability.date).startOf('day').format('YYYY/MM/DD');
		    //var endTime = moment(req.body.availability.date).startOf('day').format('YYYY/MM/DD').add(5, 'years');
		    
		    var today = new Date(year, month, day).format('yyyy-mm-dd');
		    var endsAt = new Date(year, month, day).format('yyyy-mm-dd');
		    
		    console.log(today);
		    //console.log(endTime);
		    
		    
		    Availability.create({propertyId: req.body.propertyId, available: true, startDate: today, endTime: today}).then(function(result){
			    
			    callback(null, result);
			    
		    }, function(err){
			    
			     callback(err);
		    })
	    }], function(err, result){
		    
		    if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
		    
	    });
}
	    

exports.setInfrequent = function(req, res){
    
    
    if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
    
    async.waterfall([
        function(callback){
            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
                  console.log(err);
                  callback(err, decoded);
              });
        },function(result, callback){
            
            // --------------------------------------
            // set the property to infrequent renter
            // --------------------------------------            
            Property.update({frequentRenter: false}, {where:{id: req.body.propertyId}})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
            
            
        },function(result, callback){
            // -----------------------------------
            // find all the reservation from today
            // -----------------------------------
            Availability.findAll({where:{$and:[{propertyId: req.body.propertyId},{reservationId : {$ne: null}},{date:{$gte: moment().startOf('day')}}]}}).then(
                function(result){
                    console.log(result);
                    var reservations = {
                        dates : [],
                        ids :[]
                    };
                    
                    if(result.length>0){
                        for(var i=0; i<result.length; i++){
                            reservations.dates.push(result[i].date);
                            reservations.ids.push(result[i].reservationId);
                        }
                    }
                    
                   callback(null, reservations); 
                }, function(err){
                    callback(err);
                });
        },function(result, callback){
            
            var resultObj =  result;
            // -----------------------------------
            // remove the existing records
            // -----------------------------------
         
                
                Availability.destroy({where:{propertyId: req.body.propertyId}}).then(
                function(removed){
                   callback(null, resultObj); 
                }, function(err){
                    callback(err);
                });
                
          
            
        }, function(result, callback){
           // -----------------------------------
           // add the date records
           // ----------------------------------- 
           // if(result.dates.length > 0){
                var availabilityObj = [];
                var today = moment();
  

                for(var i=0; i<420; i++){
                   var unavailableDate = moment(today).add(i, 'day');
                   unavailableDate = moment(unavailableDate).startOf('day').format('YYYY/MM/DD');


                   var dateObj = {
                       date: unavailableDate,
                       propertyId: req.body.propertyId,
                       available: false
                   }
                   var reservationIndex = result.dates.indexOf(unavailableDate);
                   if(reservationIndex != -1){
                        dateObj.dateObj = result.ids[reservationIndex]; 
                   }
                   availabilityObj.push(dateObj);
                }
                console.log(availabilityObj);
            
            Availability.bulkCreate(availabilityObj, {returning: true}).then(function(saved){
                callback(null, result);
            },function(err){
                callback(null);
            });;
            /*}else{
                var today = new Date().toISOString();
                today = today.substring(0, today.indexOf('T'));
                var nextYear = new Date();
                nextYear.setFullYear(nextYear.getFullYear()+2);
                nextYear = nextYear.toISOString();
                nextYear = nextYear.substring(0, nextYear.indexOf('T'));*/
                
                
               /*sequelize.query("INSERT INTO availability (active, propertyId, date) SELECT true, :propertyId, generate_series(':startDate'::date, ':endDate'::date,'1 day')",{replacements:{startDate: today, endDate: nextYear, propertyId: req.body.propertyId}}).spread(function(results, metadata) {
                   callback(null, results);
               });*/
               /*sequelize.query("INSERT INTO availability (active, propertyId, date) SELECT true, :propertyId, :startDate",{replacements:{startDate: today, propertyId: req.body.propertyId}}).spread(function(results, metadata) {
                   callback(null, results);
               });
            }*/
        }
        
        ], function(err, result){
        
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
        
    });
}



// -----------------------------------------------
// bulk create dates
// -----------------------------------------------

exports.setFrequent = function(req, res){
    
    
    if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
    
    async.waterfall([
        function(callback){
            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
                  console.log(err);
                  callback(err, decoded);
              });
        },function(result, callback){
            
            // --------------------------------------
            // set the property to infrequent renter
            // --------------------------------------            
            Property.update({frequentRenter: true}, {where:{id: req.body.propertyId}})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
            
        },function(result, callback){
            // -----------------------------------
            // find all the reservation from today
            // -----------------------------------
            Availability.findAll({where:{$and:[{propertyId: req.body.propertyId},{reservationId : {$ne: null}},{date:{$gte: moment().startOf('day')}}]}}).then(
                function(result){
                    console.log(result);
                    var reservations = {
                        dates : [],
                        ids :[]
                    };
                    
                    if(result.length>0){
                        for(var i=0; i<result.length; i++){
                            reservations.dates.push(result[i].date);
                            reservations.ids.push(result[i].reservationId);
                        }
                    }
                    
                   callback(null, reservations); 
                }, function(err){
                    callback(err);
                });

        },function(result, callback){

            var resultObj =  result;
            // -----------------------------------
            // remove the existing records
            // -----------------------------------
         
                
                Availability.destroy({where:{$and:[{propertyId: req.body.propertyId}, {date:{$gte: moment().format('YYYY-MM-DD')}}]}}).then(
                function(removed){
                   callback(null, resultObj); 
                }, function(err){
                    callback(err);
                });
                


        },function(result, callback){

            // -----------------------------------
           // add the date records
           // ----------------------------------- 
           // if(result.dates.length > 0){
                var availabilityObj = [];
                var today = moment();
  

                for(var i=0; i<420; i++){
                   var unavailableDate = moment(today).add(i, 'day');
                   unavailableDate = moment(unavailableDate).startOf('day').format('YYYY/MM/DD');


                   var dateObj = {
                       date: unavailableDate,
                       propertyId: req.body.propertyId,
                       available: true
                   }
                   var reservationIndex = result.dates.indexOf(unavailableDate);
                   if(reservationIndex != -1){
                        dateObj.dateObj = result.ids[reservationIndex]; 
                   }
                   availabilityObj.push(dateObj);
                }
                console.log(availabilityObj);
            
            Availability.bulkCreate(availabilityObj, {returning: true}).then(function(saved){
                callback(null, result);
            },function(err){
                callback(null);
            });



        }], function(err, result){
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
        });
};

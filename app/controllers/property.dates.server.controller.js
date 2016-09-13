// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    crypto          = require('crypto'),
    models          = require('../models'),
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

            Availability.findAll({where: {$and: [{propertyId: req.params.propertyId}, {available: false}, {reservationId: {$eq: null}}, {endDate:{$gte: moment().format('YYYY-MM-DD')}}]}, attributes: ['startDate', 'endDate']})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });

        },
        reserved: function(callback){
            Availability.findAll({where: {$and: [{propertyId: req.params.propertyId}, {reservationId: {$ne: null}}, {endDate:{$gte: moment().format('YYYY-MM-DD')}}]}, attributes: ['startDate', 'endDate']})
                .then(function(result){
                    callback(null, result);
                }, function(err){
                    callback(err);
                });
        },
        available: function(callback){
            Availability.findAll({where: {$and: [{propertyId: req.params.propertyId}, {available: true}, {reservationId: {$eq: null}}, {endDate:{$gte: moment().format('YYYY-MM-DD')}}]}, attributes: ['startDate', 'endDate']})
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

exports.updateOld = function(req, res){
    
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
// update unavailable dates from property calendar
// object : 
// { token, 
//   data :{
//		date, action, propertyId, available:false/true
//	}
// }
// ------------------------------------------------------------


exports.update = function(req, res){

    
	if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
        

        if(req.body.data.action == 'add'){
	        
	        
	        async.waterfall([
		        
		        function(callback){
		            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
			            
		                  callback(err, decoded);
		              });
		        },function(result, callback){
			        
			        
			        // --------------------------------------------
			    	// 1. update record where end-date = data.date
			    	// --------------------------------------------
			    	
			    	var nextDay = new Date(req.body.data.date);			    	
			    	nextDay.setDate(nextDay.getDate()+1);
			    	
			    	nextDay = moment(nextDay).format('YYYY-MM-DD');
			    	var lastEndDate = moment(req.body.data.date).format('YYYY-MM-DD');

			    	
			    	Availability.update({endDate: nextDay}, {where:{propertyId: req.body.data.propertyId, endDate: lastEndDate, destroyTime: null}, returning: true})
			    		.then(function(data){
				    		
				    		var updatedObj = data[1][0];
				    		callback(null, updatedObj);
				    		
				    		
			    		}, function(err){
				    		callback(err);
			    		})
			    
			    }, function(result, callback){
				    
				    
				    // ----------------------------------------------
			    	// 2. update record with start-date = data.date+1
			    	// ----------------------------------------------
			    	
			    	var nextDay = new Date(req.body.data.date);			    	
			    	nextDay.setDate(nextDay.getDate() +1);
			    	nextDay = moment(nextDay).format('YYYY-MM-DD');
			    	var newStartDate = moment(req.body.data.date).format('YYYY-MM-DD');

			    	
			    	Availability.update({startDate: newStartDate}, {where:{propertyId: req.body.data.propertyId, startDate: nextDay, destroyTime: null}, returning: true})
			    		.then(function(data){
				    		
				    		var updatedObj = data[1][0];
				    		callback(null, result, updatedObj);

				    		
			    		}, function(err){
				    		callback(err);
			    		})

				    
			    }, function(before, after, callback){
				    
				    
				    // -------------------------------------------------
					// 2.1. merge columns if there is an overlap
					// -------------------------------------------------
						    
					if(typeof before == 'undefined' && typeof after == 'undefined'){
						
					// -------------------------------------------------
					// 2.1. create the record if there was no change in
					// 		previous steps.
					// -------------------------------------------------
						
						var nextDate = new Date(req.body.data.date);	
                        
						nextDate.setDate(nextDate.getDate() +1);
						nextDate = moment(nextDate).format('YYYY-MM-DD');	
						var newStartDate = moment(req.body.data.date).format('YYYY-MM-DD');    
							    
						Availability.create({startDate:newStartDate, endDate: nextDate, propertyId: req.body.data.propertyId, available: req.body.data.available})
							.then(function(result){
								
								callback(null, result);
								    	
							}, function(err){
								callback(err);
							});
							    	
						} else if (before && after){
							
					// -------------------------------------------------
					// 2.2. merge columns if there is an overlap
					// -------------------------------------------------
							
							Availability.update({endDate:after.dataValues.endDate}, {where:{id:before.dataValues.id}, returning: true})
								.then(function(data){
									Availability.destroy({where:{id: after.dataValues.id}})
										.then(function(removed){
											
											callback(null, before);
										}, function(err){
											callback(err);
										})
									
									
								}, function(err){
									
									callback(err)
								})
							
						} else {
							
							callback(null, [before, after]);
							
						}
				    }
				  
			        
		        ], function(err, result){
			        
			            if(err){
			                res.status(500).json({ err: err});
			            }else{
			                res.json(result);
			            }
		
		        });
	        
	        
	        } else if(req.body.data.action == 'remove'){
	        	
	        	var formattedDate = moment(req.body.data.date).format('YYYY-MM-DD'); 
	        
		        async.waterfall([
			        
			        function(callback){
			            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
				            
			                  callback(err, decoded);
			              });
			        },function(result, callback){
				        
				    // --------------------------------------------
			    	// 1. find the record that needs to get updated
			    	// --------------------------------------------   

				        Availability.find({where:{propertyId: req.body.data.propertyId, available: req.body.data.available, destroyTime: null, $and:[{startDate: {$lte: formattedDate}},{endDate: {$gte: formattedDate}}]}})
				        	.then(function(data){
					        	
					        	console.log(data.dataValues);
					        	callback(null, data.dataValues);
					        	
					        	
				        	}, function(err){
					        	
					        	callback(err);
				        	})
				        
				        
				    },function(result, callback){
					    
					    console.log(result.startDate);
					    var startDate 	= moment(result.startDate).utc().format('YYYY-MM-DD');
                        console.log(result.srartDate);
					    var endDate 	= moment(result.endDate).subtract(1, 'd').utc().format('YYYY-MM-DD');
					    
					    
					    //console.log('start:', startDate, 'endDate', endDate, 'formatted', formattedDate);
					    
					// --------------------------------------------
			    	// 2.1. Remove the record if it's only one day
			    	// --------------------------------------------   
					    
					    if(moment(startDate).isSame(endDate)){
						    
						    Availability.destroy({where:{id: result.id}})
						    	.then(function(data){
							    	
							    	callback(null, data);
						    	}, function(err){
							    	callback(err);
						    	});
						
						
					// --------------------------------------------
			    	// 2.2. Update if selection is start date
			    	// --------------------------------------------       
					    } else if (moment(formattedDate).isSame(startDate)){
						    
						    var newStart = moment(result.startDate).add(1, 'd').format('YYYY-MM-DD');
						    
						    console.log(startDate);
						    Availability.update({startDate: newStart}, {where:{id: result.id}, returning: true})
						    	.then(function(data){
							    	
							    	callback(null, data);
							    	
						    	}, function(err){
							    	
							    	callback(err);
							    	
						    	})
						    
					// --------------------------------------------
			    	// 2.3. Update if selection is end date
			    	// --------------------------------------------   
			    	  
					    } else if (moment(formattedDate).isSame(endDate)){
						    
						    
						    Availability.update({endDate: formattedDate}, {where:{id: result.id}, returning: true})
						    	.then(function(data){
							    	console.log(data);
							    	
							    	callback(null, data);
							    	
						    	}, function(err){
							    	
							    	callback(err);
							    	
						
					    	});
					
					
					// ----------------------------------------------------
			    	// 2.3. create new record if selection is in the middle
			    	// ---------------------------------------------------- 
						    
					    } else {
						    
						    var newStart = moment(formattedDate).add(1, 'd').format('YYYY-MM-DD');
						    
						    
						    Availability.bulkCreate([
							  { propertyId: result.propertyId, startDate: result.startDate, endDate:formattedDate, available: req.body.data.available },
							  { propertyId: result.propertyId, startDate: newStart, endDate:result.endDate, available: req.body.data.available }
							  ]).then(function(data){
								  
								  Availability.destroy({where:{id: result.id}})
								  	.then(function(destroied){
									  	callback(null, data);
								  	}, function(err){
									  	callback(err);
								  	})
								  
							  }, function(err){
								  
								  callback(err);
							  })

					    }
					    
				    }], function(err, result){
			        
			            if(err){
			                res.status(500).json({ err: err});
			            }else{
			                res.json(result);
			            }
		
		        });
		        
	        }

    
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
             
			Availability.destroy({where:{propertyId: req.body.propertyId, reservationId:null}}).then(
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
             console.log(result);
			Availability.destroy({where:{propertyId: req.body.propertyId, reservationId:null}}).then(
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
		    
		    //var today = new Date(),
		    //	endTime = new Date().setFullYear(new Date().getFullYear() + 5);
		    	
		       //var today = moment(req.body.availability.date).startOf('day').format('YYYY/MM/DD');
		    //var endTime = moment(req.body.availability.date).startOf('day').format('YYYY/MM/DD').add(5, 'years');
		    
		    var today = new Date(year, month, day);
		    var endTime = new Date(year+5, month, day);
		    
		    Availability.create({propertyId: req.body.propertyId, available: true, startDate: today, endDate: endTime }).then(function(result){
			    
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
	    


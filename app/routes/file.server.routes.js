// Invoke 'strict' JavaScript mode
'use strict';

var jwt             = require('jsonwebtoken'),
    models          = require('../models'),
    Picture         = models.picture,
    Change         	= models.change,
    async           = require('async'),
    fs              = require('fs'),
    config          = require('../../config/config'),
    sequelize       = require('sequelize'),
    multiparty      = require('connect-multiparty'),
    multipart       = require('multiparty'),
    Jimp 			= require("jimp"),
    mkdirp          = require('mkdirp'),
    multipartMiddleware    = multiparty();
    


module.exports = function(app) {    
    
    app.post('/property/picupload', multipartMiddleware, function(req, res) {
       
         if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
       

        
    var file = req.files.file;
        
    async.waterfall([
            
        // -----------------------------------------------
        // Making sure user has the right to upload image
        // -----------------------------------------------
        function(callback){  

            jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
	              
                  callback(err, decoded);
            });
             
            // -----------------------------------------------
            // Creating the image record in the database
            // -----------------------------------------------
        },function(result, callback){
	        
	        var dirName = "public/img/property/"+req.body.propertyId;
	        
	       if (!fs.existsSync(dirName)){
               console.log('condition');
			    mkdirp(dirName, function(err){
                    console.log(err);
				    if(err){ 
			         console.log(err);
			         callback(err);    // echo the result back
			       }else{
                       console.log(result);
				       callback(null, result);
			       }
			    });
			}else{
				callback(null, result);
			}
	         	    
	    },function(result, callback){
                
                Picture.create({propertyId: req.body.propertyId, isCover: req.body.isCover})
                       .then(function(result){
                            console.log(result);
                        callback(null, result);
                }, function(err){
                    console.log(err);
                    callback(err);
                });
                
        }, 
	    function(result, callback){
		    

		    Jimp.read(file.path, function (err, binary) {
			                
					binary
						.resize(1280, Jimp.AUTO)            
						.quality(85)
						.write("public/img/property/"+req.body.propertyId+"/"+result.id+"-large.jpg", function (err, image) {
						    if (err) callback(err);
						        callback(null, result);
						    }); 
						});
	   
                
        },function(result, callback){
	            
		        Jimp.read(file.path, function (err, binary) {
			          
			        if(err) callback(err);
			        //console.log(binary.bitmap.width);
					binary
						.resize(310, Jimp.AUTO)         
						.quality(85)
						.write("public/img/property/"+req.body.propertyId+"/"+result.id+"-thumb.jpg", function (err, image) {
						    if (err) callback(err);
						    callback(null, result);
						   }); 
						});	            
	            
        }/*,function(result, callback){
	            
		        Jimp.read(file.path, function (err, binary) {
			          
			        if(err) callback(err);
			        //console.log(binary.bitmap.width);
					binary
						.resize(1400, Jimp.AUTO)            
						.quality(85)
						.write("public/img/property/"+req.body.propertyId+"/"+result.id+".jpg", function (err, image) {
						    if (err) callback(err);
						    callback(null, result);
						   }); 
						});	            
	            
        }*/, function(result, callback){
	        
	        Change.findOrCreate({where:{propertyId:req.body.propertyId, section: 'photos', reviewed:false}})
           		.then(function(data){
	           		
	           		callback(null, result)
	           		
           		}, function(err){
	           		
	           		callback(err);
           		});
	        
        }],function(err, result) {
            
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
        });
        
        

})
}
    
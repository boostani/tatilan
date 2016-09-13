// Invoke 'strict' JavaScript mode
'use strict';

var jwt             = require('jsonwebtoken'),
    models          = require('../models'),
    Picture         = models.picture,
    async           = require('async'),
    fs              = require('fs'),
    config          = require('../../config/config'),
    sequelize       = require('sequelize'),
    User            = models.user,
    multiparty      = require('connect-multiparty'),
    multipart       = require('multiparty'),
    Jimp 			= require("jimp"),
    multipartMiddleware    = multiparty();
    


module.exports = function(app) {    
    
    app.post('/profileupload', multipartMiddleware, function(req, res) {
       
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
	        
	        console.log(result);
	        var dirName = "public/img/profile/"+result.id;
	        
	       if (!fs.existsSync(dirName)){
			    fs.mkdir(dirName, function(err){
				    if(err){ 
			         callback(err);    // echo the result back
			       }else{
				       callback(null, result);
			       }
			    });
			}else{
				callback(null, result);
			}
	         	    
	    }, function(result, callback){
		    

		    Jimp.read(file.path, function (err, binary) {
			                
					binary
						.resize(680, Jimp.AUTO)            
						.quality(85)
						.write("public/img/profile/"+result.id+"/"+result.id+"-large.jpg", function (err, image) {
						    if (err) callback(err);
						        callback(null, result);
						    }); 
						});
	   
                
        },function(result, callback){
	            
		        Jimp.read(file.path, function (err, binary) {
			          
			        if(err) callback(err);
			        //console.log(binary.bitmap.width);
					binary
						.resize(160, Jimp.AUTO)   
						.cover(160, 160)        
						.quality(85)
						.write("public/img/profile/"+result.id+"/"+result.id+"-thumb.jpg", function (err, image) {
						    if (err) callback(err);
						    callback(null, result);
						   }); 
						});	            
	            
        },function(result, callback){
                
                User.update({pictureUploaded: true}, {where: {id: result.id}})
                       .then(function(data){
	                       
                        callback(null, data);
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
        
    });
}
    
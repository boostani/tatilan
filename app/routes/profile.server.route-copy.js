// Invoke 'strict' JavaScript mode
'use strict';

var jwt             = require('jsonwebtoken'),
    models          = require('../models'),
    Picture         = models.picture,
    async           = require('async'),
    aws             = require('aws-sdk'),
    fs              = require('fs'),
    config          = require('../../config/config'),
    sequelize       = require('sequelize'),
    multiparty      = require('connect-multiparty'),
    multipart       = require('multiparty'),
    User            = models.user,
    Upload          = require('s3-uploader'),
    multipartMiddleware    = multiparty();
    


module.exports = function(app) {    
    
    app.post('/profileupload', multipartMiddleware, function(req, res) {
       
        //var filename = uuid.v4();
         
        
        var file = req.files.file;

        async.waterfall([
            
            // -----------------------------------------------
            // Making sure user has the right to upload image
            // -----------------------------------------------
            function(callback){  
	            console.log(req.body);

              jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
                  
                  callback(err, decoded);
              });
             
            // -----------------------------------------------
            // Creating the image record in the database
            // -----------------------------------------------
            }, function(result, callback){
	            
                 /*var file = req.files.file;
                 var filePath = 'profile/'+result.id+'/'+result.id;
 
                                
                fs.readFile(file.path, function (err, data) {
	                console.log(file.path);
				  // ...
				  var newPath =  "./public/uploads/uploadedFileName.png";
				  fs.writeFile(newPath, data, function(err, data) {
					  if(err){
						  callback(err)
					  }else{
						  callback(null, data);
					  }
				    //res.redirect("back");
				  });
				});*/
				
				var sampleFile;
 
				if (!req.files) {
					res.send('No files were uploaded.');
					return;
				}
			 
				sampleFile = req.files.file;
				sampleFile.mv('/public/profiles/filename.jpg', function(err) {
					if (err) {
						//res.status(500).send(err);
						callback(err);
					}
					else {
						//res.send('File uploaded!');
						callback(null, result);
					}
				});

                
            },
            function(result, callback){
                
                user.update({pictureUploaded:true}, {where:{id: result.id}})
                    .then(function(data){
                        callback(null, result);   
                    }, function(err){
                        callback(err);
                    })
                
            }],function(err, result) {
            
                if(err){
                    res.status(500).json({ err: err});
                }else{
                    res.json(result);
                }
        });
        
        
    });
}
    
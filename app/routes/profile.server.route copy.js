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
	            
 
                 var file = req.files.file;
                 var filePath = result.id+'/'+result.id;
 
                var client = new Upload('tatilan-v1', {
                  aws: {
                    path: 'profile/',
                    //region: 'eu-central-1',
                    region: 'ap-south-1',   
                    acl: 'public-read',
                    accessKeyId: config.AWSAccessKey,
                    secretAccessKey :config.AWSSecretKey
                  },

                  cleanup: {
                    versions: true,
                    original: false
                  },

                  /*original: {
                    //awsImageAcl: 'private'
                      maxWidth: 1280,
                      format: 'png',
                      awsImageMaxAge: 31536000
                  },*/

                  versions: [{
                    //maxHeight: 1040,
                    maxWidth: 600,
                    format: 'jpg',
                    suffix: '-large',
                    quality: 85,
                    //awsImageExpires: 31536000,
                    //awsImageMaxAge: 31536000
                  },{
                    maxWidth: 120,
                    aspect: '1:1',
                    format: 'jpg',
                    quality: 85,
                    suffix: '-thumb'
                  }]
                });
                client.upload(file.path, {path: filePath}, function(err, versions, meta) {
                  if (err){
                      callback(err); 
                  }
                  callback(null, {details :versions, user: result});

                  /*versions.forEach(function(image) {
                       //console.log(image.width, image.height, image.url);
                      
                       callback(null, {details :versions, picture: result});
                    // 1234 4567 https://my-bucket.s3.amazonaws.com/path/ab/cd/ef.jpg 
                  });*/
                });

                
            },
            function(result, callback){
                
                User.update({pictureUploaded:true}, {where:{id: result.user.id}})
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
    
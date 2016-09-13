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
    Jimp 			= require("jimp"),
    multiparty      = require('connect-multiparty'),
    multipart       = require('multiparty'),
    uuid            = require('node-uuid'),
    Upload          = require('s3-uploader'),
    multipartMiddleware    = multiparty();
    

exports.property = function(req, res) {    
    
    if(!req.user) {
        
        return res.status(401).send({error: 'you are not logged in'});
        
    };
       
    var filename = uuid.v4();

        
    var file = req.files.file;
        
    console.log(file);
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
                
                Picture.create({propertyId: req.body.propertyId, name: filename})
                       .then(function(result){
                            console.log(result);
                        callback(null, result);
                }, function(err){
                    console.log(err);
                    callback(err);
                });
                
        }, function(result, callback){
            console.log(result.id);
            var filePath = req.body.propertyId+'/'+filename;
 
 

                  /*versions: [{
                    //maxHeight: 1040,
                    maxWidth: 980,
                    format: 'png',
                    suffix: '-large',
                    quality: 90,
                    //awsImageExpires: 31536000,
                    awsImageMaxAge: 31536000
                  },{
                    maxWidth: 224,
                    //aspect: '1:1',
                    format: 'png',
                    quality: 90,
                    suffix: '-thumb'
                  }]

                client.upload(file.path, {path: filePath}, function(err, versions, meta) {*/
                 Jimp.read(file.path, function (err, binary) {
				    if (err) throw err;
				    binary.resize(980)            // resize 
				         .quality(85)                 // set JPEG quality 
				         .write("test-large.jpg"); // save 
				});
                
            }],function(err, result) {
            
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
        });
        

        
        
    };

    
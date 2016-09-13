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
    uuid            = require('node-uuid'),
    Upload          = require('s3-uploader'),
    multipartMiddleware    = multiparty();
    


module.exports = function(app) {    
    
    app.post('/upload', multipartMiddleware, function(req, res) {
       
        var filename = uuid.v4();

        /*var form = new multipart.Form();
        form.parse(req, function(err, fields, files) {
            //console.log(fields);
                   token      = fields.token;
                   propertyId = fields.propertyId;
        });*/
         
        
        var file = req.files.file;
        
        console.log(file);
        async.waterfall([
            
            // -----------------------------------------------
            // Making sure user has the right to upload image
            // -----------------------------------------------
            function(callback){  

              jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) { 
                  console.log(err);
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
                 var file = req.files.file;
                 var filePath = req.body.propertyId+'/'+filename;
 
                var client = new Upload('tatilan-v1', {
                  aws: {
                    path: 'properties/',
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
                });
                client.upload(file.path, {path: filePath}, function(err, versions, meta) {
                  if (err){
                      callback(err); 
                  }

                  versions.forEach(function(image) {
                       //console.log(image.width, image.height, image.url);
                      
                       callback(null, {details :versions, picture: result});
                    // 1234 4567 https://my-bucket.s3.amazonaws.com/path/ab/cd/ef.jpg 
                  });
                });
                
            }],function(err, result) {
            
            if(err){
                res.status(500).json({ err: err});
            }else{
                res.json(result);
            }
        });
        
        
       
        
        
        
        /*gm(readStream)
        .resize('200', '200')
        .stream(function (err, stdout, stderr) {
          resized = fs.createWriteStream('/temp/'+2+imageType);
          stdout.pipe(resized);
        });*/
        
        /*gm(file.path)
        .resize(240, 240)
        .noProfile()
        .write('/path/to/resizedImage.png', function (err) {
          if (!err) console.log('done');
        });
        
        
        return s3fs.writeFile('2'+imageType, stream).then(function(){
            fs.unlink(file.path, function(err, result){
                if(err)  res.status(401).send({error:'Something went wrong. We could not add the new availability.'}); 
                /*s3fs.writeFile('thumb2'+imageType, resized).then(function(){
                    fs.unlink('/temp/'+2+imageType, function(err, result){
                    if(err)  res.status(401).send({error:'Something went wrong. We could not add the new availability.'});    
                    res.json(result);
                    })
                });
                res.json({test: 'here'});
        
            });
        });*/
        
        
    });
}
    
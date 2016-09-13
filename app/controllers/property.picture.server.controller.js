// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    models          = require('../models'),
    Jimp 			= require("jimp"),
    Picture         = models.picture,
    sequelize       = require('sequelize');


exports.getList = function(req, res){

    Picture.findAll({where:{$and: [{propertyId: req.params.id},{active: true}]}})
           .then(function(result){
                res.json(result);
            }, function(err){
                return res.status(401).send(err);
        })

}

exports.update = function(req, res){
    if(!req.user) {

        return res.status(401).send({error: 'you are not logged in'});

    };

    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
        if (err){
            return res.status(401).send({error:'invalid token'});
        }
    });

    Picture.update(req.body.update, {where: {id : req.body.pictureId}, returning: true})
       .then(function(result){

		   res.json(result);

	    }, function(err){
	        res.json(err);
	    });

}

exports.makeCover = function(req, res){

	if(!req.user) {

        return res.status(401).send({error: 'you are not logged in'});

    };

     async.waterfall([

		function(callback){
		    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {

		        callback(err, decoded);
		    });
		},function(result, callback){

			Picture.update({isCover: false}, {where: {propertyId:req.body.data.propertyId}, returning: true})
				.then(function(result){
					callback(null, result[1])
				}, function(err){
					callback(err);
				})

		},function(result, callback){

			Picture.update({isCover: true}, {where:{id: req.body.data.pictureId}})
				.then(function(data){
					callback(null, result[1]);
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

exports.remove = function(req, res){

    if(!req.user) {

        return res.status(401).send({error: 'you are not logged in'});

    };

    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {
        if (err){
            return res.status(401).send({error:'invalid token'});
        };
    });

    Picture.destroy({where: {id : req.body.pictureId}})
           .then(function(result){
                res.json(result);
    }, function(err){
        res.json(err);
    });
}

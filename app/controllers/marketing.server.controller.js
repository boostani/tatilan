// Invoke 'strict' JavaScript mode
'use strict';

var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    //gmail           = require('../../app/controllers/gmail.server.controller'),
    passport        = require('passport'),
    crypto          = require('crypto'),
    models          = require('../models'),
    sequelize       = require('sequelize');




exports.getLanding = function(req, res, next){

    if(req.user){
        res.render('landing', {user:req.user});
    } else {
         res.render('landing', {user:''});
    }
    
}

exports.signing = function(req, res, next){

    if(!req.user){
        res.render('signing', {user:''});
    }
}

exports.getNew = function(req, res, next){

    if(req.user){
        res.render('new', {user:req.user});
    } else {
         res.render('#/signup?redirect=property', {user:''});
    }
    
}

exports.terms = function(req, res){
	
	if(req.user){
        res.render('terms', {user:req.user});
    } else {
        res.render('terms', {user:''});
    }
}

exports.jobs = function(req, res){
	
	if(req.user){
        res.render('jobs', {user:req.user});
    } else {
        res.render('jobs', {user:''});
    }
}

exports.howToProvide = function(req, res){
	if(req.user){
        res.render('howToProvide', {user:req.user});
    } else {
        res.render('howToProvide', {user:''});
    }
}

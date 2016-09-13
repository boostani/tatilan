// Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    crypto          = require('crypto'),
    jwt             = require('jsonwebtoken'),
    models          = require('../models'),
    User            = models.user,
    Phone           = models.phone,
    sequelize       = require('sequelize');

exports.result = function(req, res){

    if(req.user){
        res.render('result', {user:req.user});
    } else {
        res.render('result', {user:''});
    }
    
  

}
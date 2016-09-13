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

exports.default = function(req, res){
    if(req.user){
        res.render('internal', {user:req.user});
    } else {
        res.redirect('/?redirect=in#/'+req.params.id);
    }
}
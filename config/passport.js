

// Invoke 'strict' JavaScript mode
'use strict';
//PostgreSQL
// Load the module dependencies
var passport    = require('passport'),
    sequelize   = require('sequelize'),
    models      = require('../app/models'),
    LocalStrategy = require('passport-local').Strategy,
    crypto          = require('crypto'),
    sequelize       = require('sequelize');
    

module.exports = function(){
    var User        = models.user;
    // Use Passport's 'serializeUser' method to serialize the user id
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

    // Use Passport's 'deserializeUser' method to load the user document
	passport.deserializeUser(function(id, done) {
        User.findOne({where:{id: id}})
            .then(function(user){
                done(null, user);
            },function(err){
                done(err, null);
        });
        
	});

	// Load Passport's strategies configuration files
	require('./strategies/local.js')();
    

}


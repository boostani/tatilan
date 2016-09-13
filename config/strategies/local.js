

// Invoke 'strict' JavaScript mode
'use strict';

var passport 		= require('passport'),
	LocalStrategy	= require('passport-local').Strategy,
    crypto          = require('crypto'),
    models          = require('../../app/models'),
    sequelize       = require('sequelize'),
    User            = models.user;



//PostgreSQL
// Create the Local strategy configuration method
module.exports = function() {
	// Use the Passport's Local strategy 
    
	passport.use(new LocalStrategy(function(username, password, done) {
		// Use the 'User' model 'findOne' method to find a user with the current username
        User.findOne({
            where: {
                username: username
            }
        }).then(function(user){

            if(!user){
                return done(null, false, {
					message: 'Unknown user'
				});
            }
            
            // If the passport is incorrect, continue to the next middleware with an error message
            var salt = user.salt;
            var hashpassword = crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
            
            
            if(hashpassword != user.password){
                return done(null, false, {
					message: 'Invalid password'
				});
            }

			// Otherwise, continue to the next middleware with the user object
			return done(null, user);
            
        }, function(err){
            console.log('couldnt find user');
            return done(err);
        });
	}));
};



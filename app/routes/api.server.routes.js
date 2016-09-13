// Invoke 'strict' JavaScript mode
'use strict';

var signing         = require('../../app/controllers/signing.server.controller'),
    property        = require('../../app/controllers/property.server.controller'),
    picture         = require('../../app/controllers/property.picture.server.controller'),
    availability    = require('../../app/controllers/property.dates.server.controller'),
    list            = require('../../app/controllers/property.list.server.controller'),
    profile         = require('../../app/controllers/profile.server.controller'),
    sms		        = require('../../app/controllers/sms.server.controller'),
    phone           = require('../../app/controllers/phone.server.controller'),
    file		    = require('../../app/controllers/picture.server.controller'),
    change			= require('../../app/controllers/change.review.server.controller.js'),
    Password		= require('../../app/controllers/password.server.controller.js'),
    passport        = require('passport'),
    models          = require('../models'),
    User            = models.user;


module.exports = function(app) {    
    
    app.route('/signup')
        .post(signing.createUser);
    
    app.route('/signin')
        .post(
        passport.authenticate('local', {
            successRedirect: '/in',
            failureRedirect: '/test'
            //failureFlash:true
    }));
    
    app.route('/checkemail')
        .post(signing.checkEmail);
    
    app.route('/checkphone')
        .post(signing.checkPhone);
    
    
    /*app.route('/register')
        .post(signing.register);*/
    
    app.route('/login')
       .post(signing.login);


    app.route('/logout')
        .get(function(req, res) {
            req.logout();
            if(typeof req.query.redirect != 'undefined') {
                res.redirect('/?redirect='+req.query.redirect);
            }else{
               res.redirect('/'); 
            }
        });
    
    // ----------------------------
    // property related apis
    // ----------------------------
    
    app.route('/property/list')
        .post(list.getList);
    
    app.route('/property/add')
        .post(property.add);
    
    app.route('/property/update/:id')
        .post(property.update);
    
    app.route('/property/pics/:id')
        .get(picture.getList);
    
    app.route('/property/removepic')
        .post(picture.remove);
        
    app.route('/property/pic/makecover')
    	.post(picture.makeCover);
    
    app.route('/property/picupdate')
        .post(picture.update);
        
   /* app.route('/property/picupload')
    	.post(file.property);*/
    
    app.route('/availability/update')
        .post(availability.update);
    
    app.route('/getavailability/:propertyId')
        .get(availability.getAvailability);
        
    app.route('/logchange')
    	.post(change.log);
    
    /*app.route('/makeunavailable')
        .post(availability.makeUnavailable);*/
    
    //app.route('/madeunavailable/:propertyId')
    //    .get(availability.madeUnavailable);
    
    app.route('/property/setInfrequent')
        .post(availability.setInfrequent);

    app.route('/property/setFrequent')
        .post(availability.setFrequent);
    
    // ----------------------------
    // profile apis
    // ----------------------------
    app.route('/profile')
        .post(profile.getData);
    
    app.route('/profile/update')
        .post(profile.update);
    
    // ----------------------------
    // Phone apis
    // ----------------------------
    app.route('/phone/isunique')
        .post(phone.isUnique);

    app.route('/phone/add')
        .post(phone.add);
    
    app.route('/phone/verify')
        .post(phone.verify);
    
    app.route('/phone/remove')
        .post(phone.remove);
    
    // ----------------------------
    // Password apis
    // ----------------------------
    app.route('/password/update')
        .post(profile.changePassword);
        
    app.route('/password/forgot') // sends the password change instruction
    	.post(Password.forgot);
    	
    app.route('/password/reset') // reset the password
    	.post(Password.reset);
        
        
    // ----------------------------
    // SMS apis
    // ----------------------------
    app.route('/sms/resendCode')
        .post(sms.resendCode);
    

};
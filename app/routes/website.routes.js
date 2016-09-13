// Invoke 'strict' JavaScript mode
'use strict';

var marketing = require('../../app/controllers/marketing.server.controller');
var property  = require('../../app/controllers/property.server.controller');
var search  = require('../../app/controllers/search.server.controller');
var admin  = require('../../app/controllers/admin.server.controller');
var password  = require('../../app/controllers/password.server.controller');
//var user = require('../../app/controllers/home.server.controller');


module.exports = function(app) {
    
    
    app.route('/')
        .get(marketing.getLanding);
    
    app.route('/signing')
        .get(marketing.signing);
       
    app.route('/property')
        .get(property.newListing);
    
    app.route('/property/:id')
        .get(property.updateListing);
    
    app.route('/result')
        .get(search.result);
    
    app.route('/house/:propertyId')
        .get(property.details);
    
    app.route('/in')
        .get(admin.default);
        
    app.route('/terms')
    	.get(marketing.terms);
    	
    app.route('/jobs')
    	.get(marketing.jobs);
    	
    app.route('/resetpassword/:token')
    	.get(password.forgotPage);
    	
    app.route('/howtorent')
    	.get(marketing.howToProvide);

    

};
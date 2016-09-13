// Invoke 'strict' JavaScript mode
'use strict';

//Set the 'NODE_ENV' variable
//process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_ENV = 'production';


// Load the 'express' module
var express     = require('./config/express'),
    passport    = require('./config/passport');

//load database
var models = require('./app/models'); 

// Create a new Express application instance
//var db          = mongoose();
var app         = express(),
    passport    = passport(),
    bodyParser  = require('body-parser');

// Use the Express application instance to listen to the '3000' port
//app.listen(3000);
app.set('port', process.env.PORT || 3000);


models.sequelize.sync().then(function () {
  var server = app.listen(app.get('port'), function() {
      // Log the server status to the console
      console.log('Server running at http://localhost:3000/ with '+process.env.NODE_ENV+' mode');
//      console.log('Server running at http://localhost:3000/env/'+process.env.NODE_ENV);
  });
});
// Log the server status to the console
//console.log('Server running at http://localhost:3000/ with '+process.env.NODE_ENV+' mode');

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;


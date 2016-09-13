// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config          = require('./config'),
	express         = require('express'),
	morgan          = require('morgan'),
	compress        = require('compression'),
	bodyParser      = require('body-parser'),
	methodOverride  = require('method-override'),
	session         = require('express-session'),
    multer          = require('multer'),
    jwt             = require('jsonwebtoken'),
    exphbs          = require('express-handlebars'),
    flash           = require('connect-flash'),
    passport        = require('passport'),
    models          = require('../app/models'),
    User            = models.user;





// Define the Express configuration method
module.exports = function() {
	// Create a new Express application instance
    
      
	var app = express();
    
 
	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
        // Configure the 'session' middleware
        /*app.use(session({
            saveUninitialized: true,
            resave: true,
            secret: config.sessionSecret
        }));*/
        
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}
    
    app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret
	}));
	// Use the 'body-parser' and 'method-override' middleware functions
    /*
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
    */
    
    /*Starts : Modified By Chirag*/
    
    app.use(bodyParser.raw({limit: '50mb'}));
    app.use(bodyParser.json({limit: "50mb"}));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    
    /*Ends : Modified By Chirag*/
    
    
	app.use(methodOverride());

    // ## CORS middleware
    // 
    // see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
          res.status(200).end();
        }
        else {
          next();
        }
    };
    app.use(allowCrossDomain);

    

    
	// Set the application view engine and 'views' folder
	app.set('views', './app/views');
    //app.engine('handlebars', exphbs({defaultLayout: 'main', layoutsDir:'app/views/layouts'}));
	app.set('view engine', 'ejs');
    app.enable('view cache');
    
    // Configure static file serving
	app.use(express.static('./public'));
	//app.use(app.router);
    
    app.use(flash());
    app.use(passport.initialize());
	app.use(passport.session());
    
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());

	// Load the 'index' routing file
    require('../app/routes/website.routes.js')(app);
    require('../app/routes/api.server.routes.js')(app);
    require('../app/routes/file.server.routes.js')(app);
    require('../app/routes/profile.server.route.js')(app);

	

	// Return the Express application instance
	return app;
};
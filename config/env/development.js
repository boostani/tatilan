// Invoke 'strict' JavaScript mode 'use strict';

// Set the 'development' environment configuration object
module.exports = {
    
//    db: 'mongodb://devAdmin:terminalPass@10.1.10.161:27017/daxima',
//    db: 'mongodb://localhost/daxima',
    dbpg : {
        hostname: 'localhost',
        username: 'siteadmin',
        password: 'sitepassword',
        database: 'tatilan'
    },
    
//    dbpg : {
//        hostname: 'localhost',
//        username: 'postgres',
//        password: 'Test1234',
//        database: 'postgres'
//    },
    
	sessionSecret: 'developmentSessionSecret',
    gmail_user: 'info@daxima.com',
    gmail_pass: 'daxinfo611',
    AWSUser: 'admin',
    AWSAccessKey: 'AKIAJPLH7AVNKVG2TB4A',
    AWSSecretKey: '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',
    sparkPost: 'b853cc9822094f0a4b626cc61b9b936a954233b7'
    
    
};
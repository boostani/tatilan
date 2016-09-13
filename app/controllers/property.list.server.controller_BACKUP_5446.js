  // Invoke 'strict' JavaScript mode
'use strict';


var jwt             = require('jsonwebtoken'),
    async           = require('async'),
    config          = require('../../config/config'),
    passport        = require('passport'),
    LocalStrategy   = require('passport-local').Strategy,
    crypto          = require('crypto'),
    models          = require('../models'),
    moment          = require('moment'),
    User            = models.user,
    Property        = models.property,
    Picture         = models.picture,
    path            = require("path"),
    Sequelize       = require('sequelize');
    var env       = process.env.NODE_ENV || "development";

    var config = require(path.join(__dirname, '../', '../', 'config', 'config'));

var sequelize = new Sequelize(config.dbpg.database, config.dbpg.username, config.dbpg.password, {
  host: config.dbpg.hostname,
  dialect: 'postgres'

});


exports.getList = function(req, res){

    jwt.verify(req.body.token, config.sessionSecret, function(err, decoded) {         
        if (err){
            return res.status(401).send({error:'invalid token'}); 

        }else{

           /* sequelize.query("SELECT * FROM property p WHERE p.id=1", { model: Property })
  .then(function(users) {
    // We don't need spread here, since only the results will be returned for select queries
                console.log(users);
                res.json(users);
  })*/

            Property.findAll(
                {
                    where: {
                        userId: decoded.id
                    },
                    include: [
                        {
                            model:Picture,
                            required: false,
                            where: {
                                isCover:true
                            },
                            attributes:['id', 'description']
                        }
                    ]
                })
                .then(function(result){

                res.json(result);
            }, function(err){
                res.status(401).send({error:err});
            });

        }
    });

}

//select p.id, p.title from property p, availability a where p.id= a.propertyId and a.available = TRUE and start_date >= "2016-06-01 00:00:00-07" and end_date <= "2016-06-01 00:00:00-07"



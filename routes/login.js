var express = require('express');
var router = express.Router();
var facade = require('../DBFacade');
var bcrypt = require('bcryptjs');
var Token = require('../Token');
var Secret = require('../Secret.js');
let mongoose = require("mongoose");
var cookieSession = require('cookie-session')
let dbConnectionString = "mongodb://127.0.0.1:27017";



router.post("/", function (req, res)
    {
        // mongoose.connect(dbConnectionString);
        //her skal vi tjekke om der er en accessToken, eller en refreshToken og sammenligner den med vores secretKey.
        console.log("her fra router: "+ req.session.accessToken)
        facade.getUser(req.body.userName, function (data)
        {
            if (data !== false)
            {

                if (bcrypt.compareSync(req.body.password, data.password))
                {

                    //steffen laver the shit
                    var refreshToken = null;

                    Token.createRefreshToken(data.username, data._id.toString(), function (newRefreshTokenCreated)
                    {

                        refreshToken = newRefreshTokenCreated.refreshToken;





                        Token.getToken(data, function (accessToken)

                        {
                            console.log("Found accessToken - " + accessToken);
                            console.log("Found refreshToken - " + refreshToken);
                            var tokens = {"accessToken": accessToken, "refreshToken": refreshToken}
                            console.log("vi sætter tokens!");
                            req.session.accessToken = accessToken;
                            req.session.refreshToken = refreshToken;
                            console.log("her er state token: " + req.session.refreshToken);
                            // mongoose.disconnect();
                            res.status(200).send(JSON.stringify(tokens));
                        });
                        // mongoose.disconnect();
                    });

                }
                else
                {
                    // mongoose.disconnect();

                    res.status(747).send(); //747 returns that the username or password is incorrect.
                }
            }
            else
            {
                // mongoose.disconnect();
                res.status(747).send(); //747 returns that the username or password is incorrect.
            }
            // mongoose.disconnect();
        })
    }
);


router.post("/user/new", function (req, res, next)
    {
        var salt = bcrypt.genSaltSync(12);
        var pw = bcrypt.hashSync(req.body.password, salt);
        // mongoose.connect(dbConnectionString);
        facade.createUser(req.body.userName, pw, req.body.admin, function (status)
            {
                if (status !== false)
                {
                    res.writeHead(200, {"refreshToken": status.refreshToken});
                    // mongoose.disconnect();
                    res.status(200).send();
                }
                else
                {
                    // mongoose.disconnect();
                    res.status(500).send();
                }
            }
        );
    }
);


module.exports = router;
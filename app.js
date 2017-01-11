var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var model = require("./model");
var User = model.User;
let Secret = require("./Secret");
var users = require('./routes/users');
let login = require("./routes/login");
let test = require("./routes/test");
var jwt = require('jsonwebtoken');
let dbFacade = require("./DBFacade");
let dbConnectionString = "mongodb://127.0.0.1:27017/test";
var cookieSession = require('cookie-session')
var cors = require('cors')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(dbConnectionString);

makecookie();

// app.use(function(req,res,next)
// {
//     if(req.session.accessToken || req.session.refreshToken)
//     {
//
//     }
//     else
//     {
//         next()
//     }
//
// });

app.use("/test", test)
app.use("/login", login);


function makecookie() {
    app.use(cookieSession({
        name: 'sessionA',
        keys: ['key1a', 'key2a'],
        // maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }))
}





console.log("LLLLLLAAAAMAAAAA");

app.get("/activecookie", function (req, res, next)
{
    if(req.session.refreshToken != null)
    {

        console.log("LLLLLLAAAAMAAAAA2222222222222222222222222222222222");
        // mongoose.connect(dbConnectionString);
        var secretKey;

        // Her henter vi først secretKey
        var getSecret = Secret.getSecretKey(function (data)
        {


            console.log("her er accesstoken --- " + req.session.accessToken)

            secretKey = data.secret;
            //Hvis vi finder secretKey går vi videre.
            if (getSecret !== null)
            {
                var accessToken = req.session.accessToken //det er navnet vi skal give accessToken i request fra client.
                // decode Token
                if (accessToken !== null || accessToken !== undefined)
                {
                    // verifies Token
                    jwt.verify(accessToken, secretKey, function (err, decoded)
                    {
                        if (err)
                        {
                            console.log("accessToken blev ikke verified.")
                            var refreshToken = req.session.refreshToken

                            console.log("HER ER TOKEN: " + refreshToken);

                            //hvis vi finder en refreshToken
                            if (refreshToken)
                            {
                                console.log("verifying refreshToken: " + refreshToken);

                                dbFacade.getUserByRefreshToken(refreshToken, function (userData,err)
                                {
                                    console.log("err: " + err + " og userData: " + userData);
                                    if (userData !== false)
                                    {

                                        console.log("userData er ikke tom! " + userData)
                                        dbFacade.getToken(userData, function (accessTokenData)
                                        {
                                            console.log("vi er i GetTOkenasdfasdf");
                                            let newAccessToken = accessTokenData;
                                            req.session.accessToken = newAccessToken;
                                            jwt.verify(newAccessToken, secretKey, function (err, decoded)
                                            {
                                                console.log("her er decoded :" + decoded + " og err: " + err);
                                                req.decoded = decoded;
                                                // mongoose.disconnect();

                                                console.log("ligefør next");
                                                var obj = {userID : decoded.data.sub}

                                                console.log(decoded + " her er decoded bitch")

                                                res.status(200).send(obj);
                                            });
                                        });
                                    }
                                    else
                                    {
                                        // mongoose.disconnect();
                                        res.status(401).send(false);
                                    }
                                });
                            }
                            else
                            {
                                res.status(401).send(false);
                            }
                        }
                        else
                        {
                            // if everything is good, save to request for use in other routes
                            req.session.accessToken = accessToken;
                            req.decoded = decoded;
                            console.log("accessToken blev verified");
                            // mongoose.disconnect();

                            var obj = {userID : decoded.data.sub}
                            console.log(decoded.data.sub + " her er decoded bitch")
                            res.status(200).send(obj);
                        }
                    });

                }
                else
                {
                    console.log("No Token found will start redirecting...")
                    // if there is no Token
                    //redirect user to login page.
                    // mongoose.disconnect();
                    res.status(403).send();
                }
            }
        })

    }

});








app.all('/api/*', function (req, res, next)
{
    console.log("LLLLLLAAAAMAAAAA2222222222222222222222222222222222");
    // mongoose.connect(dbConnectionString);
    var secretKey;

    // Her henter vi først secretKey
    var getSecret = Secret.getSecretKey(function (data)
    {
        secretKey = data.secret;
        //Hvis vi finder secretKey går vi videre.
        if (getSecret !== null)
        {
            var accessToken = req.session.accessToken; //det er navnet vi skal give accessToken i request fra client.
            // decode Token
            if (accessToken !== null || accessToken !== undefined)
            {
                // verifies Token
                jwt.verify(accessToken, secretKey, function (err, decoded)
                {
                    if (err)
                    {
                        console.log("accessToken blev ikke verified.")
                        var refreshToken = req.session.refreshToken;

                        console.log("HER ER TOKEN: " + refreshToken);

                        //hvis vi finder en refreshToken
                        if (refreshToken)
                        {
                            console.log("verifying refreshToken: " + refreshToken);

                            dbFacade.getUserByRefreshToken(refreshToken, function (userData,err)
                            {
                                console.log("err: " + err + " og userData: " + userData);
                                if (userData !== false)
                                {

                                    console.log("userData er ikke tom! " + userData)
                                    dbFacade.getToken(userData, function (accessTokenData)
                                    {
                                        console.log("vi er i GetTOkenasdfasdf");
                                        let newAccessToken = accessTokenData;
                                        req.session.accessToken = newAccessToken;
                                        jwt.verify(newAccessToken, secretKey, function (err, decoded)
                                        {
                                            console.log("her er decoded :" + decoded + " og err: " + err);
                                            req.decoded = decoded;
                                            // mongoose.disconnect();
                                            console.log("ligefør next");
                                            next();
                                        });
                                    });
                                }
                                else
                                {
                                    // mongoose.disconnect();
                                    res.status(401).send(false);
                                }
                            });
                        }
                        else
                        {
                            res.status(401).send(false);
                        }
                    }
                    else
                    {
                        // if everything is good, save to request for use in other routes
                        req.session.accessToken = accessToken;
                        req.decoded = decoded;
                        console.log("accessToken blev verified");
                        // mongoose.disconnect();
                        next();
                    }
                });

            }
            else
            {
                console.log("No Token found will start redirecting...")
                // if there is no Token
                //redirect user to login page.
                // mongoose.disconnect();
                res.status(308).redirect("/login");
            }
        }
    })
});

app.use('/api/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// error handler
app.use(function (err, req, res, next)
{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;

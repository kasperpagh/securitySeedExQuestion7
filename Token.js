/**
 * Created by kaspe on 2016-12-17.
 */


var jwt = require('jsonwebtoken');
var uuid = require('node-uuid');
var secret = require("./Secret");
var user = require("./model");
let User = user.User;
let mongoose = require("mongoose");


var accessToken = null;

var refreshToken = null;

function _getToken(userData, callback)
{
    secret.getSecretKey(function (data, err)
    {
        if (data)
        {
            console.log("her er sec igen: " + data.secret);
            createClaim(userData, data.secret);
            callback(accessToken);
        }
        else
        {
            console.log("her er token err: " + err)
            console.log("fejl i getToken!");
        }
    });
}


function createClaim(userData, secretKey)
{

    var claims =
        {
            sub: userData[0].username,
            iss: "www.keebin.dk",
            admin: userData[0].admin
        }
    createAccessToken(claims, secretKey)
}


function createAccessToken(claims, secretKey)
{
    console.log("running create AccessToken");
    //create accessToken
    accessToken = jwt.sign({
        data: claims
    }, secretKey, {expiresIn: 900});

    console.log("accessToken has been created: " + accessToken); //this is what our accessToken looks like.
}

//create refreshToken - this happens every time a user logs in.
function _createRefreshToken(userName, userId, callback)
{
    //vi putter userId ind forrest sådan så reFreshToken altid vil være unik.
    var refreshToken = userId + uuid.v4();
    console.log("here is a new refreshToken: " + refreshToken);
    console.log("user Id is: " + userId);
    var userRefreshTokenUpdated = false;


    User.findOneAndUpdate({username: userName}, {refreshToken: refreshToken},{new: true}, function (err, user)
    {
        if (err)
        {
            console.log("cannot update user: " + userName + " with a refreshToken")
        }
        else
        {
            console.log("her er user fra createRToken: " + user);
            callback(user);
            console.log(user);
        }

    });


}


module.exports = {getToken: _getToken, createRefreshToken: _createRefreshToken};

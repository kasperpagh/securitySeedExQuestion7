/**
 * Created by kaspe on 2016-12-17.
 */


let model = require("./model.js");
var User = model.User;
var mongoose = require('mongoose');
let Token = require("./Token");
let dbConnectionString = "mongodb://127.0.0.1:27017";


let getUser = function (userName, callback)
{

    User.findOne({username: userName}, function (err, user)
    {

        if (err)
        {
            console.log("fejl i find");
        }
        else
        {
            // object of the user
            console.log("vi finder een user, med usrName = " + userName + ":\n" + user + "\n\n");
            callback(user)
        }


    });
};


let getUserByRefreshToken = function (refreshToken, callback)
{
    User.find({refreshToken: refreshToken}, function (err, user)
    {
        if (err)
        {
            console.log("her er ERR: " + err);
            callback(false);
        }
        else
        {
            if (user.length > 0)
            {
                console.log("abekat: " + user);
                callback(user);
            }
            else
            {
                console.log("her er USER: " + user);
                callback(false)
            }

        }
    });
};


let getToken = function (userData, callback)
{
    Token.getToken(userData, function (data)
    {
        callback(data);
    });
}


let createUser = function (userName, password, isAdmin, callback)
{

    let newUser = new User
    ({
        username: userName,
        password: password,
        admin: isAdmin,
        refreshToken: null
    });

    newUser.save(function (err, user)
    {
        if (err)
        {
            console.log("fejl i create user");
            callback(false)
        }
        else
        {
            console.log("user created");
            Token.createRefreshToken(user.username, user._id.toString(), function (data)
            {
                callback(data)
            });

        }

    })
};


let updateUser = function (oldUserName, updatedUser, callback)
{
    console.log("here is ")
    User.findOneAndUpdate({username: oldUserName}, {
        username: updatedUser
    }, function (err, user)
    {
        if (err)
        {
            callback(false)
            console.log("fejl i updatedUser " + err);
        }

        // we have the updated user returned to us
        callback(true)
        console.log(user);

    });
};

let deleteUserByUserName = function (userName, callback)
{
    User.findOneAndRemove({username: userName}, function (err)
    {
        if (err)
        {
            callback(false)
            console.log("fejl i delete");
        }
        else
        {
            callback(true)
            console.log('User deleted!');
        }
    });
};



let getAllUsers = function (callback)
{
    User.find({}, function (err, user)
    {
        if (err)
        {
            console.log("fejl i find: " + err);
        }
        else
        {
            callback(user)
        }
    });
}

module.exports =
    {
        deleteUserByUserName: deleteUserByUserName,
        updateUser: updateUser,
        createUser: createUser,
        getUser: getUser,
        getUserByRefreshToken: getUserByRefreshToken,
        getToken: getToken,
        getAllUsers: getAllUsers
    };




























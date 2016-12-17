/**
 * Created by kaspe on 2016-12-17.
 */

var uuid = require('node-uuid');
var model = require("./model");
let mongoose = require("mongoose");
var secret = model.Secret;

var secretKey = uuid.v4();
let dbConnectionString = "mongodb://127.0.0.1:27017";

// _createSecret(secretKey);

function _createSecret() // this creates a secret. ONLY TO BE RUN ONCE
{
// mongoose.connect(dbConnectionString);
    console.log("_createSecret is running.")
    let newSecret = new secret
    ({
        name: "test",
        secret: uuid.v4()
    });

    newSecret.save(function (err)
    {
        if (err)
        {
            console.log("secret kunne ikke gemmes:(");
        }

    });
// mongoose.disconnect();
};

// _createSecret();

//Token creation

function _getSecretKey(callback)
{
    secret.find({name: 'test'}, function (err, secret)
    {
        if (err)
        {
            console.log("cant find secret");
            callback(err);
        }
        else
        {
            callback(secret[0]);
        }
    });
}


module.exports = {getSecretKey: _getSecretKey};
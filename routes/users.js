var express = require('express');
var router = express.Router();
let dbFacade = require("../DBFacade.js");
let mongoose = require("mongoose");
let dbConnectionString = "mongodb://127.0.0.1:27017";
var model = require("../model");
var User = model.User;


router.get("/getuser/:username", function (req, res, next)
{
    console.log("vi er i restlol");

    dbFacade.getUser(req.params.username, function (data)
    {
        console.log("her er usrToreturn: " + data);
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify(data));
    });
});


router.put('/edit/:oldusername/:newusername', function(req, res) {

console.log(req.params.oldusername + " username here!!!!")
    console.log(req.params.newusername)


dbFacade.updateUser(req.params.oldusername, req.params.newusername, function (data)
{
    console.log(" i am reached!!")
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end(JSON.stringify(data));


});
});

router.get("/all", (req, res, next) =>
{
    console.log("i find all users")
    dbFacade.getAllUsers(function(docs)
    {
        let returnData = []
        for(i = 0; i < docs.length; i++)
        {
            returnData.push({username: docs[i].username, id: docs[i]._id})
        }
        console.log("HER ER JSON: " + JSON.stringify(returnData))
        res.end(JSON.stringify(returnData));
    })
});


router.delete("/deleteuser/:username", function (req, res, next)
{

        dbFacade.deleteUserByUserName(req.params.username, function (status)
        {
            if (status === false)
            {

                res.status(500).send("user er ikke slettet!");
            }
            else
            {
                res.writeHead(200, {"Content-Type": "application/json"});
                res.send();
            }

        });



});

module.exports = router;

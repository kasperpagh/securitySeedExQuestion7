// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
// create a schema
var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    admin: {type: Boolean, required: true},
    refreshToken: {type: String}
});

// custom method to add string to end of name
// you can create more important methods like name validations or formatting
// you can also do queries and find similar users
userSchema.methods.HnS = function ()
{
    // add some stuff to the users name
    var salt = bcrypt.genSaltSync(12);
    var pw = bcrypt.hashSync(this.password, salt);
    return pw;
};

// on every save, add the date
userSchema.pre('save', function (next)
{

    next();
});


// the schema is useless so far
// we need to create a model using it

var secretSchema = new Schema({
    name: {type: String, required: true, unique: true},
    secret: {type: String, required: true}
});


var User = mongoose.model('User', userSchema);
var Secret = mongoose.model("Secret", secretSchema);




module.exports = {
    User: User,
    Secret: Secret
}

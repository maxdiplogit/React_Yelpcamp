const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    }
});


// Plugins are a tool for reusing logic in multiple schemas
// The below line will add on to our 'userSchema' a 'username' field and a 'password' field.
// The below line will also add on a 'hash' and 'salt' field, the hashed password and the salt value.
// The below line also makes sure that those 'username's are unique and not duplicated.
// It also gives us some additional methods that we can use.
UserSchema.plugin(passportLocalMongoose);


const User = mongoose.model('User', UserSchema);


module.exports = User;
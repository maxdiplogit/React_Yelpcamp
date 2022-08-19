userSchema.statics.findAndValidate = async function (username, password) {
    const foundUser = await this.findOne({ username });
};


// Below we are not using the arrow notation of defining a function because we need access to the 'this' object.
userSchema.pre('save', function(next) {
    // Here 'this' refers to user object being 'saved'
    // We are checking that if the password has been modified or not, so that we don't rehash the password again when user changes his/her username.
    if (this.isModified('password')) {
        return next();
    }
    this.password = 'NOT YOUR REAL PASSWORD!';
    next();
});
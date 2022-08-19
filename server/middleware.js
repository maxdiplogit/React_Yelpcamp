module.exports.isLoggedIn = (req, res, next) => {
    console.log("User: ", req.user);
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
        next();
    } else {
        const err = 'Not Logged In!';
        next(err);
    }
};
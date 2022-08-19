// Packages
const express = require('express');
const passport = require('passport');

// Router
const router = express.Router();

// Models
const User = require('../models/user');

// Error Handler Helpers
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Middlewares
const { isLoggedIn } = require('../middleware');


// API Routes
router.post('/login', passport.authenticate('local'), catchAsync(async (req, res, next) => {
    console.log('LOGIN');
    console.log(req.body);
    console.log(req.user);
    res.json({ id: req.user._id, username: req.user.username });
}));

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        // HTTP 307 Temporary Redirect redirect status response code indicates that the resource requested has been temporarily moved to the URL given by the Location headers.
        // The method and the body of the original request are reused to perform the redirected request.
        res.redirect(307, '/users/login');
    } catch (error) {
        console.log(error);
        res.json({ userAlreadyExists: true });
    }
}));

router.post('/logout', isLoggedIn, catchAsync(async (req, res, next) => {
    console.log('LOGOUT');
    console.log(req.user);
    const err = false;
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.json({ isLoggedIn: false });
}));

router.get('/getUser', isLoggedIn, catchAsync(async (req, res, next) => {
    console.log(req.user);
    res.json(req.user);
}));


module.exports = router;
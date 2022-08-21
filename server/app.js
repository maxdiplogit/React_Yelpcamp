// Getting access to '.env' credentials
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// Packages
const express = require('express')
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
// The below module lets you authenticate using a username and password in your Node.js applications. By plugging into Passport, local authentication can be easily and unobtrusively integrated into any application or framework that supports Connect-style middleware, including Express.
const LocalStrategy = require('passport-local');


// Models
const User = require('./models/user');


// Routers
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews');
const usersRouter = require('./routes/users');


// Database Connection
const dbURI = '';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Mongoose Connection Open');
    })
    .catch((err) => {
        console.log('Oh no! Mongoose connection error!');
        console.log(err);
    });


// Creating express application
const app = express();


// Configurations
const sessionConfig = {
    secret: 'thisisnotagoodsecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7,
        sameSite: 'strict'
    }
};


// Middlewares 
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));
app.use(express.json());
app.use(methodOverride('_method'));
// Passport shall be initialized before configuring cookie and session for the express application
app.use(passport.initialize());
app.use(cookieParser("thisisnotagoodsecret"));
app.use(session(sessionConfig));


// Passport setup
app.use(passport.session());
// The below line says that, "Hey passport, we would like you to use the LocalStrategy that we have downloaded and required."
// For that LocalStrategy, the authentication method is going to be located on our 'User' Model and it's called 'authenticate'.
passport.use(new LocalStrategy(User.authenticate()));
// Serializer and Deserializer, which will tell Passport how to save the login credentials in the browser session and retrieve them later.
// Serialization basically refers to how do we get data or, how do we store a user in a session
passport.serializeUser(User.serializeUser());
// DeSerialization is the opposite of serialization, which means that how we get the user out of that session.
passport.deserializeUser(User.deserializeUser())


// APIs
app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);
app.use('/users', usersRouter);


// Error Handling Middlewares
app.use((err, req, res, next) => {
    console.log(err);
    console.log(err.name);
    next(err);
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong!' } = err;
    console.log(statusCode, message);
    next(err);
});


// Starting the server
app.listen(3030, () => {
    console.log('Serving on port 3030');
});

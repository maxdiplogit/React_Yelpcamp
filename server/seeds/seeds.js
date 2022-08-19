const mongoose = require('mongoose');

// Models
const Campground = require('../models/campground');

// Helpers
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');


const dbURI = 'mongodb+srv://maxdiplo:711CHDha@cluster0.rewi6.mongodb.net/yelpcamp?retryWrites=true&w=majority';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((res) => {
        console.log('Mongo connection successful');
    })
    .catch((err) => {
        console.log('Oh no! Mongoose connection error!');
        console.log(err)
    });


const sample = (array) => {
    return array[ Math.floor(Math.random() * array.length) ];
};


const seedDB = async () => {
    await Campground.deleteMany({});

    for (let i = 0; i < 20; i++) {
        const random1000 = Math.floor(Math.random() * 1000);

        const camp = new Campground({
            location: `${ cities[random1000].city }, ${ cities[random1000].state }`,
            title: `${ sample(descriptors) } ${ sample(places) }`,
            images: [
                {
                  url: 'https://res.cloudinary.com/maxdiplo/image/upload/v1659980974/React_YelpCamp/kloza8mxej7qsqe7c0ev.png',
                  filename: 'React_YelpCamp/kloza8mxej7qsqe7c0ev',
                },
                {
                  url: 'https://res.cloudinary.com/maxdiplo/image/upload/v1659980974/React_YelpCamp/q2mmlyex1efuqbkrtl5x.png',
                  filename: 'React_YelpCamp/q2mmlyex1efuqbkrtl5x',
                }
            ],
            author: '62ca7b2cebeb5757c842863e',
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            }
        });

        await camp.save();
    }
};


seedDB()
    .then(() => {
        mongoose.connection.close();
    });
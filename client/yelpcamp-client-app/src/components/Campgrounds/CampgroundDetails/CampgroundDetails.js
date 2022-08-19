import axios from 'axios';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './CampgroundDetails.module.css';


// Components
import ReviewsList from '../../Reviews/ReviewsList/ReviewsList';


const CampgroundDetails = () => {
    const navigate = useNavigate();
    const params = useParams();

    const ratingRef = useRef();
    const bodyRef = useRef();

    const [ campground, setCampground ] = useState({});
    const [ author, setAuthor ] = useState({});
    const [ campgroundImages, setCampgroundImages ] = useState([]);
    const [ reviews, setReviews ] = useState([]);

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const loggedInUser = useSelector((state) => state.auth.loggedInUser);
    
    const id = params.campgroundId;
    
    const fetchCampground = useCallback(async () => {
        try {
            const fetchedCampground = await axios.get(`/campgrounds/${ id }`);
            console.log(fetchedCampground.data);
            console.log("Author: ", fetchedCampground.data.author.username);
            setCampground(fetchedCampground.data);
            setAuthor(fetchedCampground.data.author);
            setCampgroundImages(fetchedCampground.data.images);
            setReviews(fetchedCampground.data.reviews);
        } catch (err) {
            console.log('Oh no! Could not fetch campground!');
            console.log(err);
        }
    }, []);
    

    useEffect(() => {
        fetchCampground();
    }, []);


    const deleteFormSubmitHandler = async (event) => {
        event.preventDefault();

        try {
            const res = await axios.post(`/campgrounds/${ id }?_method=DELETE`);
            navigate('/campgrounds');
        } catch (err) {
            console.log('Oh no! Could .not delete campground!');
            console.log(err);
        }
    };

    const reviewFormSubmitHandler = async (event) => {
        event.preventDefault();

        const rating = ratingRef.current.value;
        const body = bodyRef.current.value;

        try {
            const res = await axios.post(`/campgrounds/${ id }/reviews`, {
                rating: rating,
                body: body
            });
            console.log(res);
            setReviews(res.data.reviews);
        } catch (err) {
            console.log('Oh no! Could not create your review!');
            console.log(err);
        }
    };

    let content = <></>;

    if (isLoggedIn) {
        if (loggedInUser.username === author.username) {
            content = <>
                <div>
                    <h1>{ campground.title }</h1>
                    <p>{ campground.location }</p>
                    <p>{ author.username }</p>
                </div>
                <div>
                    <ul>
                        { campgroundImages.map((image) => (
                            <li key={ image._id }>
                                <img src={ image.url } alt='...'></img>
                            </li>
                        )) }
                    </ul>
                </div>
                <div>
                    <form onSubmit={ deleteFormSubmitHandler }>
                        <button>Delete</button>
                    </form>
                </div>
                <div>
                    <form onSubmit={ reviewFormSubmitHandler }>
                        <div>
                            <label htmlFor='rating'>Rating: </label>
                            <input ref={ ratingRef } type='range' id='rating' min='1' max='5' />
                        </div>
                        <div>
                            <label htmlFor='body'>Review: </label>
                            <input ref={ bodyRef } type='text' id='body' />
                        </div>
                        <button>Post Review</button>
                    </form>
                </div>
                <div>
                    <ReviewsList campgroundId={ campground._id } reviews={ reviews } setReviews_propFunction={ setReviews } />
                </div>
            </>;
        } else {
            content = <>
                <div>
                    <h1>{ campground.title }</h1>
                    <p>{ campground.location }</p>
                    <p>{ author.username }</p>
                </div>
                <div>
                    <ul>
                        { campgroundImages.map((image) => (
                            <li key={ image._id }>
                                <img src={ image.url } alt='...'></img>
                            </li>
                        )) }
                    </ul>
                </div>
                <div>
                    <form onSubmit={ reviewFormSubmitHandler }>
                        <div>
                            <label htmlFor='rating'>Rating: </label>
                            <input ref={ ratingRef } type='range' id='rating' min='1' max='5' />
                        </div>
                        <div>
                            <label htmlFor='body'>Review: </label>
                            <input ref={ bodyRef } type='text' id='body' />
                        </div>
                        <button>Post Review</button>
                    </form>
                </div>
                <div>
                    <ReviewsList campgroundId={ campground._id } reviews={ reviews } setReviews_propFunction={ setReviews } />
                </div>
            </>
        }
    } else {
        content = <>
            <div>
                <h1>{ campground.title }</h1>
                <p>{ campground.location }</p>
                <p>{ author.username }</p>
            </div>
            <div>
                <ul>
                    { campgroundImages.map((image) => (
                        <li key={ image._id }>
                            <img src={ image.url } alt='...'></img>
                        </li>
                    )) }
                </ul>
            </div>
            <div>
                <ReviewsList campgroundId={ campground._id } reviews={ reviews } setReviews_propFunction={ setReviews } />
            </div>
        </>
    }

    return (
        <>
            { content }
        </>
    );
};


export default CampgroundDetails;
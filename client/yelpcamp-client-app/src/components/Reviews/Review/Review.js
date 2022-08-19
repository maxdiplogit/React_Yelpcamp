import axios from 'axios';

// React Helpers
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import styles from './Review.module.css';


const Review = (props) => {
    const navigate = useNavigate();

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const loggedInUser = useSelector((state) => state.auth.loggedInUser);
    const [ reviewUser, setReviewUser ] = useState({});

    const fetchReviewUser = async () => {
        try {
            const res = await axios.get(`/campgrounds/${ props.campgroundId }/reviews/getReviewUser/${ props.reviewUserId }`);
            console.log(res);
            setReviewUser(res.data);
        } catch (err) {
            console.log('Oh no! Could not fetch the reviewUser');
            console.log(err);
        }
    };

    useEffect(() => {
        fetchReviewUser();
    }, []);

    const deleteReviewHandler = (event) => {
        event.preventDefault();

        try {
            const res = axios.post(`/campgrounds/${ props.campgroundId }/reviews/${ props.id }?_method=DELETE`);
            props.setReviews_propFunction((prevReviews) => prevReviews.filter((review) => review._id !== props.id));
        } catch (err) {
            console.log('Oh no! Could not delete Review.');
            console.log(err);
        }
    };

    let content = <></>;

    if (isLoggedIn) {
        if (loggedInUser.username === reviewUser.username) {
            content = <li>
                <div>
                    <h4>{ props.rating }</h4>
                    <p>{ props.body }</p>
                    <p>{ reviewUser.username }</p>
                    <form onSubmit={ deleteReviewHandler }>
                        <button>Delete</button>
                    </form>
                </div>
            </li>;
        } else {
            content = <li>
                <div>
                    <h4>{ props.rating }</h4>
                    <p>{ props.body }</p>
                    <p>{ reviewUser.username }</p>
                </div>
            </li>;
        }
    } else {
        content = <li>
            <div>
                <h4>{ props.rating }</h4>
                <p>{ props.body }</p>
                <p>{ reviewUser.username }</p>
            </div>
        </li>;
    }

    return (
        <>
            { content }
        </>
    );
};


export default Review;
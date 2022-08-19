import styles from './ReviewsList.module.css';

import Review from '../Review/Review';


const ReviewsList = (props) => {
    return (
        <ul>
            { props.reviews.map((review) => (
                <Review
                    key={ review._id }
                    id={ review._id }
                    campgroundId={ props.campgroundId }
                    reviewUserId={ review.reviewUser }
                    rating={ review.rating }
                    body={ review.body }
                    setReviews_propFunction={ props.setReviews_propFunction }
                />
            )) }
        </ul>
    );
};


export default ReviewsList;
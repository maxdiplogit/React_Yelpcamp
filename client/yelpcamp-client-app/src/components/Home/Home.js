import axios from 'axios';

// React Helpers
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { authActions } from '../../store/index';

import styles from './Home.module.css';


const Home = (props) => {
	const dispatch = useDispatch();

    // var check = false;
	// const [ user, setUser ] = useState({});
	// if (document.cookie) {
	// 	check = true;
		// const getUser = async () => {
		// 	const res = await axios.get('/users/getUser');
		// 	setUser(res.data);
		// }
		// console.log('Getting Called Again!!!');
		// getUser();
	// }

    // const [ isLoggedInState, setIsLoggedInState ] = useState(check);
	const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
	const loggedInUser = useSelector((state) => state.auth.loggedInUser);
	console.log("From useSelector Home.js isLoggedIn: ", isLoggedIn);
	console.log("From useSelector Home.js loggedInUser: ", loggedInUser);
    
    const submitLogoutHandler = async (event) => {
		event.preventDefault();

		try {
			const res = await axios.post('/users/logout', { withCredentials: true });
			dispatch(authActions.changeIsLoggedIn(false));
			dispatch(authActions.changeLoggedInUser({}));
			// setIsLoggedInState(false);
			document.cookie += "; max-age=0";
			console.log(res);
		} catch (err) {
			console.log('Oh no! Could not logout!');
			console.log(err);
		}
	};

	var content = <></>;

	if (isLoggedIn) {
		content = <>
			{/* <p>Welcome { user.username }</p> */}
			<form onSubmit={ submitLogoutHandler }>
				<button type="submit">Logout</button>
			</form>
		</>;
	} else {
		content = <h4>You are not logged in!</h4>;
	}
    
    return (
        <>
            <h1>React YelpCamp</h1>
            { content }
        </>
    );
};


export default Home;
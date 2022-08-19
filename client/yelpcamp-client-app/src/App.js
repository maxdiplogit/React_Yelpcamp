import axios from 'axios';

// React hooks
import { useEffect, useCallback } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

// Components
import Home from './components/Home/Home';
import CampgroundsList from './components/Campgrounds/CampgroundsList/CampgroundsList';
import CampgroundDetails from './components/Campgrounds/CampgroundDetails/CampgroundDetails';
import NewCampground from './components/Campgrounds/NewCampground/NewCampground';
import EditCampground from './components/Campgrounds/EditCampground/EditCampground';
import RegisterForm from './components/Users/RegisterForm/RegisterForm';
import LoginForm from './components/Users/LoginForm/LoginForm';

import { authActions } from './store/index';

import './App.css';


const App = () => {
	// console.log("Cookies: ", document.cookie.split(';'));

	// const fetchCampgroundsHandler = async () => {
	// 	try {
	// 		const fetchedCampgrounds = await axios.get('http://localhost:3030/campgrounds');
	// 		console.log(fetchedCampgrounds.data);
	// 		setCampgrounds(fetchedCampgrounds.data);
	// 	} catch (err) {
	// 		console.log('API Error!');
	// 		console.log(err);
	// 	}
	// };
	const dispatch = useDispatch();

	if (!document.cookie) {
		dispatch(authActions.changeIsLoggedIn(false));
		dispatch(authActions.changeLoggedInUser({}));
	}

	return (
		<>
			<Routes>
				<Route path='/' element={ <Home /> } />
				<Route path='/register' element={ <RegisterForm /> } />
				<Route path='/login' element={ <LoginForm /> } />
				<Route path='/campgrounds' element={ <CampgroundsList /> } />
				<Route path='/campgrounds/newCampground' element={ <NewCampground /> } />
				<Route path='/campgrounds/:campgroundId' element={ <CampgroundDetails /> } />
				<Route path='/campgrounds/:campgroundId/edit' element={ <EditCampground /> } />
			</Routes>
		</>
	);
}


export default App;
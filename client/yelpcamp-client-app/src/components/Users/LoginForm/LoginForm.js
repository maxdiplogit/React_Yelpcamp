import axios from 'axios';

// React Helpers
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { authActions } from '../../../store/index';

import styles from './LoginForm.module.css';


const LoginForm = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const usernameRef = useRef();
    const passwordRef = useRef();

    // var check = false;
	// if (document.cookie) {
	// 	check = true;
	// }


    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    // console.log(isLoggedIn);

    
    const loginFormSubmitHandler = async (event) => {
        event.preventDefault();
        
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try {
            const res = await axios.post('/users/login', {
                username,
                password
            }, { withCredentials: true });
            dispatch(authActions.changeIsLoggedIn(true));
            dispatch(authActions.changeLoggedInUser(res.data));
            console.log(res);
            navigate('/');
        } catch (error) {
            console.log('Oh no! Could not Login you!');
            console.log(error);
        }
    };


    var content = <></>;
    
    if (isLoggedIn) {
        content = <h4>You are already logged in!</h4>;
    } else {
        content = <form onSubmit={ loginFormSubmitHandler }>
            <div>
                <label htmlFor='username'>Username: </label>
                <input ref={ usernameRef } type='text' id='username' />
            </div>
            <div>
                <label htmlFor='password'>Password: </label>
                <input ref={ passwordRef } type='password' id='password' />
            </div>
            <button type='submit'>Login</button>
        </form>;
    }
    
    return (
        <>
            { content }
        </>
    );
};


export default LoginForm;
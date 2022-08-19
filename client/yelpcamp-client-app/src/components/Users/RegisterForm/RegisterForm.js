import axios from 'axios';

// React Helpers
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Store actions
import { authActions } from '../../../store/index';

// import styles from './RegisterForm.module.css';


const RegisterForm = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // var check = false;
    // if (document.cookie) {
    //     check = true;
    // }
    

    const emailRef = useRef();
    const usernameRef = useRef();
    const passwordRef = useRef();

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    
    const registerFormSubmitHandler = async (event) => {

        event.preventDefault();

        const email = emailRef.current.value;
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try {
            const res = await axios.post(`/users/register`, {
                email,
                username,
                password
            }, { withCredentials: true });
            console.log(res);
            if (res.data.userAlreadyExists) {
                console.log("User already exists! Try Logging in.");
                navigate('/login');
            } else {
                dispatch(authActions.changeIsLoggedIn(true));
                dispatch(authActions.changeLoggedInUser(res.data));
                navigate('/');
            }
        } catch (err) {
            console.log('Oh no! Could not register the user!');
            console.log(err);
        }
    };


    var content = <></>;

    if (isLoggedIn) {
        content = <h4>You must logout first!</h4>;
    } else {
        content = <form onSubmit={ registerFormSubmitHandler }>
            <div>
                <label htmlFor='email'>Email: </label>
                <input type='email' id='email' ref={ emailRef } />
            </div>
            <div>
                <label htmlFor='username'>Username: </label>
                <input type='text' id='usernmame' ref={ usernameRef } />
            </div>
            <div>
                <label htmlFor='password'>Password: </label>
                <input type='password' id='password' ref={ passwordRef } />
            </div>
            <button>Register</button>
        </form>;
    }


    return (
        <>
            { content }
        </>
    );
};


export default RegisterForm;
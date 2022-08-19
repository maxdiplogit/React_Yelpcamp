import axios from 'axios';

// React Helpers
import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import styles from './NewCampground.module.css';


const NewCampground = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [ title, setTitle ] = useState('');
    const [ location, setLocation ] = useState('');
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ filename, setFilename ] = useState(null);

    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    const titleChangeHandler = (event) => {
        setTitle(event.target.value);
    };
    
    const locationChangeHandler = (event) => {
        setLocation(event.target.value);
    };

    const fileSelectedHandler = (event) => {
        console.log("Length: ", event.target.files.length);
        const temp = [];
        for (let i = 0; i < event.target.files.length; i++) {
            temp.push(event.target.files[i]);
        }
        console.log(temp);
        setSelectedFile(temp);
        setFilename(event.target.files[0].name);
    };
    
    const formSubmitHandler = async (event) => {
        event.preventDefault();

        let formData = new FormData();
        
        formData.append('title', title);
        formData.append('location', location);

        for (let i = 0; i < selectedFile.length; i++) {
            formData.append('images', selectedFile[i]);
        }
        // const data = {
        //     title: title,
        //     location: location,
        //     // The below argument will be used by multer in the backend and hence is not visible in our route handlers because that will now be stored in 'req.files'
        //     images: selectedFile
        // };
        // console.log("Data from form: ", data);

        try {
            const res = await axios.post('/campgrounds', formData, {
                headers: {
                    "content-type": "multipart/form-data"
                }
            });
            // titleRef.current.value = '';
            // locationRef.current.value = '';
            // Display error if something is wrong with the input entered by the user in the form and stop him from navigating to the '/campgrounds/${ id }'s page.
            navigate(`/campgrounds/${ res.data._id }`);
        } catch (err) {
            console.log('Oh no! Something went wrong while sending a POST request to our API server!');
            console.log(err);
        }
    };

    var content = <></>;

    if (isLoggedIn) {
        content = <form onSubmit={ formSubmitHandler } encType="multipart/form-data">
                    <div>
                        <label htmlFor='title'>Campground Name: </label>
                        <input type='text' id='title' onChange={ titleChangeHandler } />
                    </div>
                    <div>
                        <label htmlFor='location'>Location: </label>
                        <input type='text' id='location' onChange={ locationChangeHandler } />
                    </div>
                    <div>
                        <label htmlFor='images'>Upload Images: </label>
                        <input type='file' id='images' multiple name='images' onChange={ fileSelectedHandler } />
                    </div>
                    <button type='submit'>Create Campground</button>
                  </form>;
    } else {
        content = <h4>You must be logged in, in order to add a new campground.</h4>;
    }
    
    return (
        <>
            { content }
        </>
    );
};


export default NewCampground;
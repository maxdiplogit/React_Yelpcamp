import axios from 'axios';

// React Helpers
import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import styles from './EditCampground.module.css';


const EditCampground = (props) => {
    const params = useParams();
    const navigate = useNavigate();

    // const titleRef = useRef();
    // const locationRef = useRef();

    const [ campground, setCampground ] = useState({});
    const [ campgroundTitle, setCampgroundTitle ] = useState('');
    const [ campgroundLocation, setCampgroundLocation ] = useState('');
    const [ campgroundImages, setCampgroundImages ] = useState([]);
    const [ selectedFile, setSelectedFile ] = useState([]);
    const [ checkedState, setCheckedState ] = useState([]);
    const [ author, setAuthor ] = useState({});

    // Store Values
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    const loggedInUser = useSelector((state) => state.auth.loggedInUser);

    const id = params.campgroundId;
    
    const fetchCampground = useCallback(async () => {
        try {
            const fetchedCampground = await axios.get(`/campgrounds/${ id }`);
            console.log("Fetched Data: ", fetchedCampground.data);
            setCampground(fetchedCampground.data);
            setCampgroundTitle(fetchedCampground.data.title);
            setCampgroundLocation(fetchedCampground.data.location);
            setAuthor(fetchedCampground.data.author);
            setCampgroundImages(fetchedCampground.data.images);
            setCheckedState(new Array(fetchedCampground.data.images.length).fill(false));
        } catch (err) {
            console.log('Oh no! Could not fetch campground!');
            console.log(err);
        }
    });


    useEffect(() => {
        fetchCampground();
    }, []);


    let formSubmitHandler = () => {};
    let onTitleChangeHandler = () => {};
    let onLocationChangeHandler = () => {};
    let fileSelectedHandler = () => {};
    let checkboxHandler = () => {};

    if (isLoggedIn && loggedInUser.username === author.username) {
        formSubmitHandler = async (event) => {
            event.preventDefault();

            const deleteImages = [];

            console.log(deleteImages);
            
            let formData = new FormData();
            
            formData.append('title', campgroundTitle);
            formData.append('location', campgroundLocation);
            
            for (let i = 0; i < selectedFile.length; i++) {
                formData.append('images', selectedFile[i]);
            }
            
            for (let i = 0; i < campgroundImages.length; i++) {
                if (checkedState[i]) {
                    formData.append('deleteImages', campgroundImages[i].filename);
                }
            };


            try {
                const res = await axios.post(`/campgrounds/${ id }?_method=PUT`, formData, {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                });
                // Display error if something is wrong with the input entered by the user in the form and stop him from navigating to the '/campgrounds/${ id }'s page.
                navigate(`/campgrounds/${ id }`);
            } catch (err) {
                console.log('Oh no! Something went wrong while sending a PUT request to our API server!');
                console.log(err);
            }
        };

        onTitleChangeHandler = (event) => {
            setCampgroundTitle(event.target.value);
        };

        onLocationChangeHandler = (event) => {
            setCampgroundLocation(event.target.value);
        };
        
        checkboxHandler = (event) => {
            // for array index => parseInt(event.target.id)
            const selectedCheckboxId = parseInt(event.target.id);
            console.log("Checkbox: ", selectedCheckboxId);
            const updatedCheckboxState = checkedState.map((item, index) => index === selectedCheckboxId ? !item : item);
            setCheckedState(updatedCheckboxState);
        };

        fileSelectedHandler = (event) => {
            const temp = [];
            for (let i = 0; i < event.target.files.length; i++) {
                temp.push(event.target.files[i]);
            }
            console.log(temp);
            setSelectedFile(temp);
        };
    }


    let content = <></>;

    if (isLoggedIn) {
        if (loggedInUser.username === author.username) {
            content = <form onSubmit={ formSubmitHandler } encType='multipart/form-data'>
                <div>
                    <label htmlFor='name'>Campground Name: </label>
                    <input type='text' id='name' value={ campgroundTitle } onChange={ onTitleChangeHandler } />
                </div>
                <div>
                    <label htmlFor='location'>Location: </label>
                    <input type='text' id='location' value={ campgroundLocation } onChange={ onLocationChangeHandler } />
                </div>
                <div>
                    <label htmlFor='images'>Add Images: </label>
                    <input type='file' id='images' multiple name='images' onChange={ fileSelectedHandler } />
                </div>
                <div>
                    <ul>
                        { campgroundImages.map((image, i) => (
                            <li key={ i }>
                                <img src={ image.url } alt='...'></img>
                                <label htmlFor={ i }>Delete?</label>
                                <input type='checkbox' id={ i } name='deleteImage' value={ image.filename } onChange={ checkboxHandler }></input>
                            </li>
                        )) }
                    </ul>
                </div>
                <button type='submit'>Update Campground</button>
            </form>;
        } else {
            content = <h1>You are not authorized to edit this campground.</h1>;
        }
    } else {
        content = <h1>You are neither authenticated nor authorized to edit this campground.</h1>
    }


    return (
        <>
            { content }
        </>
    );
};


export default EditCampground;
import axios from "axios";

// Components
import Campground from '../Campground/Campground';

// import mapboxgl from 'mapbox-gl';
// import { Map, Source, Layer, GeoJSONSource, LayerProps } from 'react-map-gl';

// ClusterMap
import ReactMapboxGl from 'react-mapbox-gl';
import { ReactMapboxGlCluster } from 'react-mapbox-gl-cluster';
import { data } from '../../../data';
import 'mapbox-gl/dist/mapbox-gl.css';

// React Helpers
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import styles from './CampgroundsList.module.css';


const CampgroundsList = (props) => {
    const [ campgrounds, setCampgrounds ] = useState([]);
    const [ mapData, setMapData ] = useState({});

    const Map = ReactMapboxGl({
        accessToken: 'pk.eyJ1IjoibWF4ZGlwbG8iLCJhIjoiY2t4azl0NmwyMDBsYTJ2a29neDdtdnd4ZSJ9.C-LCEmN7249TQAUDxld9BA'
    });

    const mapProps = {
        center: [-95.7129, 37.0902],
        zoom: [3],
        style: 'mapbox://styles/mapbox/dark-v10',
        containerStyle: {
            height: '60vh',
            width: '100vw'
        }
    };

    // const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

    useEffect(() => {
		const fetchCampgrounds = async () => {
			try {
				const fetchedCampgrounds = await axios.get('/campgrounds', {
                    withCredentials: true
                });
                const features = [];
                for (let i = 0; i < fetchedCampgrounds.data.length; i++) {
                    const temp = {
                        type: "Feature",
                        properties: {},
                        geometry: fetchedCampgrounds.data[i].geometry
                    };
                    features.push(temp);
                }
                const tempMapData = {
                    type: 'FeatureCollection',
                    features: features
                }
                console.log(tempMapData);
				console.log(fetchedCampgrounds.data);
				setCampgrounds(fetchedCampgrounds.data);
                setMapData(tempMapData);
			} catch (err) {
				console.log('API Error!');
				console.log(err);
			}
		}

		fetchCampgrounds();
	}, []);

    return (
        <>
            <Map { ...mapProps }>
                <ReactMapboxGlCluster data={ mapData } />
            </Map>
            {/* <div className={ styles.map } id="map"></div> */}
            <ul>
                { campgrounds.map((campground) => (
                    <Campground
                        key={ campground._id }
                        title={ campground.title }
                        location={ campground.location }
                    />
                )) }
            </ul>
        </>
    );
};


export default CampgroundsList;
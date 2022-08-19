import styles from './Campground.module.css';


const Campground = (props) => {
    return (
        <li>
            <div>
                <h1>{ props.title }</h1>
                <p>{ props.location }</p>
            </div>
        </li>
    )
};


export default Campground;
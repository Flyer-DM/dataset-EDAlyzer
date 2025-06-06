import classes from './ShowToggleButton.module.css'

const ShowToggleButton = ({ children, ...props }) => {
    return (
        <button className={classes.ShowToggleButton} onClick={props.onClick}>
            {children}
        </button>
    );
}

export default ShowToggleButton;
import { useState } from 'react';
import classes from './EdaButton.module.css'

const EdaButton = ({children, ...props}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className={classes.wrapper}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && <div className={classes.descrPopup}>{props.descr}</div>}
            <button className={classes.eduButton} onClick={props.onClick} style={props.style}>
                {children}
            </button>
        </div>
    );
}

export default EdaButton;
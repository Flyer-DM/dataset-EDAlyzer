import { useState } from 'react';
import classes from './EdaButton.module.css'

const EdaButton = ({children, ...props}) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {hovered && <div className={classes.descrPopup}>{props.descr}</div>}
            <button className={classes.eduButton} onClick={props.onClick}>
                {children}
            </button>
        </div>
    );
}

export default EdaButton;
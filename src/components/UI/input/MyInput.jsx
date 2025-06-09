import classes from './MyInput.module.css'


const MyInput = ({ children, ...props }) => {


    return (
        <>
            <input className={classes.defaultInput}
                type={props.type}
                placeholder={props.placeholder}
                onChange={props.onChange}
                value={props.value}>
                {children}
            </input>
        </>
    );
}

export default MyInput;
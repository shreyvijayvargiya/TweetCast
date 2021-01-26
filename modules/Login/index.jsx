import React from 'react';
import { Button, InputLabel, TextField, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import app from '../../utils/firebase';
import { setCookie } from '../../utils/cookie';
import { useRouter } from 'next/router';
import { AiOutlineGoogle } from 'react-icons/ai';
import { GoogleLogin } from 'react-google-login';
import firebase from 'firebase';
import { setUserInStore } from '../../redux/action';
import { useDispatch } from 'react-redux';


const Login = () => {
    const router = useRouter();
    const [values, setValues] = React.useState({
        email: '',
        password: ''
    });
    const dispatch = useDispatch();

    const [error, setError] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);

    const classes = useStyles();

    const handleChange = (event) => {
        const val = event.target.value;
        const name = event.target.name;
        setValues((prevState) => ({ ...prevState, [name]: val }))
    };
    React.useEffect(() => {
        if(values.email.trim(" ").length > 0 && values.password.trim(" ").length > 0)   {
            setDisabled(false)
        }else {
            setDisabled(true)
        }
    })

    const handleSubmit = (e) => {
        app.auth().signInWithEmailAndPassword(values.email, values.password).then((res) => {
            setCookie('uid', res.user.uid, 14);
            const user = {
                userId: res.user.uid,
                email,
            }
            dispatch(setUserInStore(user));
            router.push({ pathname: '/dashboard', query: { type: 'tweets'}})
        })
        .catch((error) => setError(error.message));
    };
    
  
    const handleGoogleLogin = (e) => {
        e.preventDefault();
        const auth = firebase.auth();
        const googleProvider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(googleProvider).then((res) => {
            const user = {
                userId: res.user.uid,
                email: res.user.email,
            }
            setCookie('uid', res.user.uid, 14);
            dispatch(setUserInStore(user));
            router.push({ pathname: '/dashboard', query: { type: 'tweets'}})
          }).catch((error) => {
            console.log(error.message)
        });
    }

    return (
        <div className={classes.root}>
            <div className={classes.box}>
                    <Typography variant="h6">Sign In</Typography>
                    <br />
                    <br />
                    {error && <InputLabel>{error}</InputLabel>}
                    <InputLabel className={classes.label} htmlFor="component-simple">Email</InputLabel>
                    <TextField 
                        id="component-simple-email" 
                        placeholder="Enter email" 
                        size="small"  
                        color="primary" 
                        type="email"
                        variant="outlined" 
                        name="email" 
                        value={values.email} 
                        onChange={handleChange}
                        className={classes.input}
                    />
                    <br />
                    <InputLabel className={classes.label} htmlFor="component-simple">Password</InputLabel>
                    <TextField 
                        id="component-simple-password" 
                        placeholder="Enter password" 
                        size="small"  
                        name="password" 
                        variant="outlined" 
                        type="password"
                        value={values.password}
                        onChange={handleChange} 
                        className={classes.input}
                    />
                    <br />
                    <Button
                        name="gogole-login-button"
                        type="primary"
                        color="primary"
                        variant="outlined"
                        className={classes.googleButton}
                        onClick={(e) => handleGoogleLogin(e)}
                    >
                        <AiOutlineGoogle />
                    </Button>
                    <br />
                    <Button 
                        color="primary" 
                        variant="contained"
                        fullWidth
                        className={classes.button}
                        disabled={disabled}
                        onClick={() => handleSubmit()}
                    >
                        Login
                    </Button>
            </div>
        </div>
    );
};
export default Login;

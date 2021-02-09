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
    const [values, setValues] = React.useState({
        email: '',
        password: ''
    });
    const [error, setError] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);
    const classes = useStyles();
    const dispatch = useDispatch();
    const router = useRouter();

    React.useEffect(() => {
        if(values.email.trim(" ").length > 0 && values.password.trim(" ").length > 0)   {
            setDisabled(false)
        }else {
            setDisabled(true)
        }
    });

    const handleChange = (event) => {
        const val = event.target.value;
        const name = event.target.name;
        setValues((prevState) => ({ ...prevState, [name]: val }))
    };

    const handleSubmit = (e) => {
        app.auth().signInWithEmailAndPassword(values.email, values.password).then((res) => {
            setCookie('uid', res.user.uid, 14);
            const user = {
                userId: res.user.uid,
                email,
            }
            dispatch(setUserInStore(user));
            let dbRef = app.database().ref("users");
            dbRef.push({
                email: email,
                dashboardAcccess: true,
                userType: 'staff'
            });
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
            let dbRef = app.database().ref("users");
            dbRef.on('value', snap => {
                const usersObject = snap.val();
                const userExist = Object.keys(usersObject).filter(item => {
                    if(usersObject[item].email === res.user.email) return item
                });
                if(userExist.length > 0){
                    setError("");
                    setCookie('uid', res.user.uid, 14);
                    dispatch(setUserInStore(user));
                    router.push({ pathname: '/dashboard', query: { type: 'tweets'}})
                }else {
                    setError('Need invitation from admin to logged in');
                    setDisabled(true);
                }
            });
          }).catch((error) => {
            console.log(error.message)
        });
    };

    const checkEmailExist = (e) => {
        const emailValue = e.target.value;
        let dbRef = app.database().ref("users");
        dbRef.on('value', snap => {
            const usersObject = snap.val();
            const userExist = Object.keys(usersObject).filter(item => {
                if(usersObject[item].email === emailValue) return item
            });
            if(userExist.length > 0){
                setError('Need invitation from admin to logged in');
                setDisabled(true);
            }else {
                setError("");
                setDisabled(false)
            }
        })
    }

    return (
        <div className={classes.root}>
            <div className={classes.box}>
                    <Typography variant="h6">Sign In</Typography>
                    <br />
                    <br />
                    {error && <InputLabel>{error}</InputLabel>}
                    <br />
                    <br />
                    <InputLabel className={classes.label} htmlFor="component-simple">Email</InputLabel>
                    <TextField 
                        id="component-simple-email" 
                        placeholder="Enter email" 
                        size="small"  
                        color="primary" 
                        type="email"
                        variant="outlined"
                        onBlur={checkEmailExist}
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
                        size="small"
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

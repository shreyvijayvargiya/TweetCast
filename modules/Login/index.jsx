import React from 'react';
import { Button, InputLabel, TextField, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import app from '../../utils/firebase';
import { setCookie } from '../../utils/cookie';
import { useRouter } from 'next/router';

const Login = () => {
    const router = useRouter();
    const [values, setValues] = React.useState({
        email: '',
        password: ''
    });
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
            router.push({ pathname: '/dashboard', query: { type: 'tweets'}})
        })
        .catch((error) => setError(error.message));
    };
    
    // const ref = app.database().ref()
    // ref.on("value", (snap) => console.log(snap.value), (error) => console.log(error))

    return (
        <div className={classes.root}>
            <form noValidate autoComplete="off" className={classes.box}>
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
                    color="primary" 
                    variant="contained"
                    fullWidth
                    className={classes.button}
                    disabled={disabled}
                    onClick={() => handleSubmit()}
                >
                    Login
                </Button>
            </form>
        </div>
    );
};
export default Login;

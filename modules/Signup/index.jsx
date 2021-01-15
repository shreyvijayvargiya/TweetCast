import React from 'react';
import { Button, InputLabel, TextField, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import app from '../../utils/firebase';
import { setCookie } from '../../utils/cookie';
import { useRouter } from 'next/router';
import { AiOutlineGoogle } from 'react-icons/ai';
import { GoogleLogin } from 'react-google-login';

const Signup = () => {

    const [values, setValues] = React.useState({
        email: '',
        password: '',
        username: ''
    });
    const router = useRouter();
    const [error, setError] = React.useState(null);
    const [disabled, setDisabled] = React.useState(true);

    const classes = useStyles();

    const handleChange = (event) => {
        const val = event.target.value;
        const name = event.target.name;
        setValues((prevState) => ({ ...prevState, [name]: val}));
    };

    React.useEffect(() => {
        if(values.email.trim(" ").length > 0 && values.password.trim(" ").length > 0)   {
            setDisabled(false)
        }else {
            setDisabled(true)
        }
    });

    const handleSubmit = () => {
        app.auth().createUserWithEmailAndPassword(values.email, values.password).then((res) => {
            setCookie('uid', res.user.uid, 14);
            router.push({ pathname: '/dashboard', query: { type: 'tweets'}})
        })
        .catch((error) => setError(error.message));
    };

    function responseGoogle(response){
        console.log(response)
    };

    return (
        <div className={classes.root}>
            <form noValidate autoComplete="off" className={classes.box}>
                <Typography variant="h6">Sign Up</Typography>  
                <br />
                <br />
                {error && <InputLabel>{error}</InputLabel>}
                <InputLabel className={classes.label} htmlFor="component-simple">Email</InputLabel>
                <TextField id="component-simple-email" 
                    placeholder="Enter email" 
                    size="small"  
                    color="primary" 
                    variant="outlined" 
                    name="email" 
                    type="email"
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
                <GoogleLogin
                    clientId={process.env.GOOGLE_CLIENT_ID}
                    render={renderProps => (
                        <Button 
                            onClick={renderProps.onClick} 
                            className={classes.googleButton}
                            color="primary"
                            variant="outlined"
                            >
                                <AiOutlineGoogle />
                            </Button>
                        )}
                    onFailure={responseGoogle}
                    onSuccess={() => handleSubmit()}
                    cookiePolicy={'single_host_origin'}
                    className={classes.googleButton}
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
                    Signup
                </Button>
            </form>
        </div>
    );
};
export default Signup;

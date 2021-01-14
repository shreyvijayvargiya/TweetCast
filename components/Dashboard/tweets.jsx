import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';

const TweetsPanel = () => {
    const [message, setMessage] = React.useState("");
    const classes = styles();

    const handleChange = (e) => {
        const value = e.target.value;
        setMessage(value);
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6">Tweet the message</Typography>
            <br />
            <TextField id="component-simple" 
                placeholder="Enter Message" 
                size="medium"  
                color="primary" 
                fullWidth
                type="email"
                variant="outlined" 
                name="message"
                value={message}
                onChange={handleChange}
            />
            <br />
            <br />
            <Button 
                size="large" 
                color="primary" 
                variant="contained" 
                fullWidth
                disabled={message.trim(" ").length >0 ? false: true}
            >
                Tweet The Message
            </Button>
        </div>
    );
};
export default TweetsPanel;

const styles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        overflow: 'hidden',
        padding: theme.spacing(8),
        width: 700
    }
}))
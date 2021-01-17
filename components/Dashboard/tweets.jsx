import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import Link from 'next/link';

const TweetsPanel = () => {
    const [message, setMessage] = React.useState("");
    const classes = styles();
    const router = useRouter();
    
    const handleChange = (e) => {
        const value = e.target.value;
        setMessage(value);
    };

    const handleTweetButton = () => {
        router.push(`https://twitter.com/intent/tweet?text=${message}`);
    }
    const url = `https://twitter.com/intent/tweet?text=${message}`;

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
                    // onClick={() => handleTweetButton()}
                    disabled={message.trim(" ").length >0 ? false: true}
                >
                    <a target="_blank" href={url} style={{ color: message.trim(" ").length > 0 ? 'white': 'black', textDecoration: 'none' }}>
                        Tweet the message
                    </a>
                </Button>
            <br />
        </div>
    );
};
export default TweetsPanel;

const styles = makeStyles((theme) => ({
    root: {
        // height: '90vh',
        overflow: 'hidden',
        padding: theme.spacing(8),
        width: 700
    }
}))
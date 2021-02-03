import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Snackbar, Paper, TextField, Switch, AppBar, Box, Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import app from '../../utils/firebase';
import LikedPanel from './LikedPanel';
import CommentsPanel from './CommentsPanel';
import RetweetPanel from './RetweetPanel';  
import TweetsPanel from './ScheduleTweets';

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
};


const ScheduledTweetsActions = () => {
    const classes = styles();
    const [email, setEmail] = React.useState("");
    const [likedScheduleTweets, setLikedScheduleTweets] = React.useState(null);
    const [disabled, setDisabled] = React.useState(false);
    const [message, setMessage] = React.useState(null);
    const [user, setUser] = React.useState({
        email: "",
        id: ""
    });

    const [list, setList] = React.useState({
        liked: null,
        comments: null,
        retweets: null
    })

    const fetchUserFromFirebaseApi = () => {
        app.auth().onAuthStateChanged(user => {
            if(user) {
                setUser(prevState => ({...prevState, email: user.email, userId: user.uuid }));
           }else {
               return null
           }
        });
    };
    

    React.useEffect(() => {
        fetchUserFromFirebaseApi();
    }, [ ]);

    const [value, setValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
      setValue(newValue);
    };

    const renderActiveTab = () => {
        if(value === 0) return <TweetsPanel email={user.email} />
        else if(value === 1) return <LikedPanel email={user.email} />
        else if(value === 2) return <CommentsPanel email={user.email} />
        else if(value === 3) return <RetweetPanel email={user.email}  />
        else  return <TweetsPanel email={email} />
    }
    return (
        <div className={classes.root}>
           <AppBar position="static" className={classes.appbar}>
                <Grid container spacing={2}>
                    <Grid item md={3}>
                        <Button className={classes.button} color="primary" onClick={() => setValue(0)} variant={value === 0 ? 'contained': 'outlined'}>Scheduled Tweets</Button>
                    </Grid>
                    <Grid item md={3}>
                        <Button className={classes.button}  color="primary" onClick={() => setValue(1)} variant={value === 1 ? 'contained': 'outlined'}>Scheduled Likes</Button>
                    </Grid>
                    <Grid item md={3}>
                        <Button className={classes.button}  color="primary" onClick={() => setValue(2)} variant={value === 2 ? 'contained': 'outlined'}>Scheduled Comments</Button>
                    </Grid>
                    <Grid item md={3}>
                        <Button className={classes.button}  color="primary" onClick={() => setValue(3)} variant={value === 3 ? 'contained': 'outlined'}>Scheduled Retweets</Button>
                    </Grid>
                </Grid>
            </AppBar>
            <br />
            {renderActiveTab()}
        </div>
    );
};
export default ScheduledTweetsActions;


const styles = makeStyles((theme) => ({
    root: {
        width: '70vw',
        overflow: 'hidden',
        padding: theme.spacing(8)
    },
    paper: {
        padding: theme.spacing(2)
    },
    table: {
        minWidth: 800
    },
    list: {
        maxHeight: '30vh',
        overflow: 'scroll'
    },
    appbar: {
        backgroundColor: 'rgba(134, 134, 134, 0.13)',
        padding: theme.spacing(4),
        borderRadius: 8,
        boxShadow: 'none',
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)'
    },
    button: {
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)',
        textTransform: 'none'
    }
}));
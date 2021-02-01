import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Snackbar, Paper, TextField, Switch, Tabs, Tab, AppBar, Box, Grid } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import app from '../../utils/firebase';


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

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    };
    
    const handleSwitchChange = (id) => {
        let dbRef = app.database().ref();
        let childRef = dbRef.child("users").child(id).child("dashboardAcccess");
        childRef.transaction((val) => {
            return !val;
        });
    };

    const handleSendInvitation = () => {
        let dbRef = app.database().ref("users");
        Object.keys(users.users).map(item => {
            if(users.users[item].email === email){
                setDisabled(true);
                setMessage("Email already exist");
            }else {
                dbRef.push({
                    email,
                    dashboardAcccess: true,
                    userType: 'staff'
                });
                setEmail("");
                setMessage("Invitation sent successfully");
            }
        });
    };

    const fetchScheduleLikeTweetsFromFirebase = () => {
        let dbRef = app.database().ref("scheduledLikedOnTweets");
        dbRef.on("value", snap => setUsers((prevState) => ({ ...prevState, likedScheduleTweets: snap.val() })));
    };

    React.useEffect(() => {
        // fetchScheduleLikeTweetsFromFirebase();
    }, [ ]);

    const [value, setValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
      setValue(newValue);
    };

    const renderActiveTab = () => {
        if(value === 0) return <p>Scheduled Liked</p>
        else if(value === 1) return <p> Scheduled Comments</p>
        else if(value === 2) return <p>Scheduled Retweets</p>
        else  return <p>Scheduled Liked</p>
    }
    return (
        <div className={classes.root}>
           <AppBar position="static" className={classes.appbar}>
                {/* <Tabs value={value} onChange={handleTabChange} aria-label="simple tabs example">
                <Tab label="Scheduled Likes" />
                <Tab label="Scheduled Comments" />
                <Tab label="Scheduled Retweets" />
                </Tabs> */}
                <Grid container spacing={2}>
                    <Grid item md={4}>
                        <Button color="primary" onClick={() => setValue(0)} variant={value === 0 ? 'contained': 'outlined'}>Scheduled Likes</Button>
                    </Grid>
                    <Grid item md={4}>
                        <Button color="primary" onClick={() => setValue(1)} variant={value === 1 ? 'contained': 'outlined'}>Scheduled Comments</Button>
                    </Grid>
                    <Grid item md={4}>
                        <Button color="primary" onClick={() => setValue(2)} variant={value === 2 ? 'contained': 'outlined'}>Scheduled Retweets</Button>
                    </Grid>
                </Grid>
            </AppBar>
            {renderActiveTab()}
           {/* <TableContainer>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ border: 'none' }}>
                                {message && <label>{message}</label>}
                                <TextField id="component-simple" 
                                    placeholder="Enter email" 
                                    size="small"  
                                    color="primary" 
                                    fullWidth
                                    type="email"
                                    variant="outlined" 
                                    name="email" 
                                    value={email}
                                    onChange={handleChange}
                                />
                            </TableCell>
                            <TableCell align="right" style={{ border: 'none' }}>
                                <Button disabled={email.trim(" ").length > 0 ? false: true || disabled} onClick={() => handleSendInvitation()} color="primary" variant="contained">Send Invitation</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
           </TableContainer>
           <br />
           <br />
           <br />
           <br />
           <TableContainer component={Paper}>
                <Table aria-label="simple table" className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">Email</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body1">Access</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.list}>
                        {users && users.users && Object.keys(users.users).map(item => {
                            return (
                                <TableRow key={item}>
                                    <TableCell>
                                        {users.users[item].email}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Switch
                                            checked={users.users[item].dashboardAcccess}
                                            onChange={() => handleSwitchChange(item)}
                                            name={item.id}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
           </TableContainer> */}
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
        backgroundColor: '#868686',
        padding: theme.spacing(4),
        boxShadow: 'none',
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)'
    }
}));
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography ,Table, TableContainer,Paper, TableBody, TableRow, TableCell, Fab, TableHead, Switch, Modal, Grid, CircularProgress, IconButton } from '@material-ui/core';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import app from '../../utils/firebase';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FiCamera } from 'react-icons/fi';

const TweetsPanel = () => {

    const [message, setMessage] = React.useState({
        message: "",
        editableMessage: "",
        createdAt: new Date(),
        currentId: null,
        fileData: null
    });

    const [tweets, setTweets] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const classes = styles();

    
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setMessage(prevState => ({ ...prevState, [name]: value }));
    };

    const handleTweetButton = () => {
        let dbRef = app.database().ref("tweets");
        dbRef.push({
            message: message.message,
            email: user ? user.email: "",
            image: null,
            createdAt: message.createdAt,
            approved: false,
            fileName: null
        });
        setMessage(prevState => ({ ...prevState, message: "" }));
    };

    const fetchTweets = () => {
        let dbRef = app.database().ref("tweets");
        dbRef.on("value", snap => {
            setTweets((prevState) => ({ ...prevState, tweets: snap.val() }))
        });
    };
    const fetchUserFromFirebase = () => {
        app.auth().onAuthStateChanged(user => {
            if(user) {
                setUser({email: user.email, userId: user.uuid });
           }
        });
    }

    React.useEffect(() => {
        fetchTweets();
        fetchUserFromFirebase();
    }, [ ]);


    const handleChecked = (id, e) => {
        const checked = e.target.checked;
        if(!checked){
            let dbRef = app.database().ref("tweets/" +  id);
            dbRef.remove().then((data) => console.log(data));
        }else {
            let dbRef = app.database().ref();
            let childRef = dbRef.child("tweets").child(id).child("approved");
            childRef.transaction((val) => {
                return !val;
            });
        }
    };

    const openModal = (item) => {
        const value = tweets.tweets[item].message;
        setMessage(prevState => ({ ...prevState, editableMessage: value, currentId: item  }))
        setOpen(true);
    };
    const updateMessage = () => {
        setLoader(true);
        let dbRef = app.database().ref();
        let childRef = dbRef.child("tweets").child(message.currentId).child("message");
        childRef.transaction(() => { 
            setLoader(false);
            return message.editableMessage 
        });
        setLoader(false);
        setOpen(false);
    };

    const handleUploadClick = (event) => {
        event.preventDefault();
        const reader = new FileReader();
    
        reader.onload = () => {
            setMessage(prevState => ({ ...prevState, fileData:reader.result }));
            setOpen(true);
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    return (
        <div className={classes.root}>
             <Paper elevation={2} style={{ padding: '10px', backgroundColor: '#EEEEEE'}}>
                <Typography variant="h6">Create Tweets</Typography>
                <br />
                <Grid container spacing={2}>
                    <Grid item md={9}>
                        <TextField id="component-simple" 
                            placeholder="Enter Message" 
                            size="medium"  
                            color="primary" 
                            fullWidth
                            type="email"
                            type="text"
                            variant="outlined" 
                            name="message"
                            value={message.message}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={3}>
                        <TextField id="component-simple" 
                            placeholder="Select Date " 
                            size="medium"  
                            color="primary" 
                            type="email"
                            type="date"
                            variant="outlined" 
                            name="createdAt"
                            value={message.createdAt}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item md={2} className={classes.uploadContainer}>
                        <TextField
                            className={classes.input}
                            id="contained-button-file"
                            multiple
                            type="file"
                            variant="outlined" 
                            onChange={handleUploadClick}
                        />
                        <label htmlFor="contained-button-file">
                            <Fab color="primary" size="small" component="span" className={classes.fabButton}>
                                <FiCamera />
                            </Fab>
                        </label>
                    </Grid>
                </Grid>
                <br />
                <br />
                    <Button 
                        size="large" 
                        color="primary" 
                        variant="contained" 
                        fullWidth
                        onClick={() => handleTweetButton()}
                        disabled={(message.message).trim(" ").length >0 ? false: true}
                    >
                        Schedule Tweet
                    </Button>
            </Paper>
            <br />
            <br />
            <br />
            <br />
            <Paper elevation={2} style={{ padding: '10px', backgroundColor: '#EEEEEE'}}>
                <Typography>Scheduled Tweet</Typography>
            </Paper>
            <br />
            <div>
                <TableContainer>
                    <Table>
                        <TableHead className={classes.table}>
                            <TableRow>
                                <TableCell style={{ width: '30vw' }}>
                                    <Typography>Email</Typography>
                                </TableCell>
                                <TableCell align="center">
                                    <Typography>Details</Typography>
                                </TableCell>
                                <TableCell align="right"> 
                                    <Typography>Approved/Decline</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
                <br />
                <TableContainer>
                    <Table>
                        <TableBody>
                            {tweets && Object.keys(tweets.tweets).length > 0 ? Object.keys(tweets.tweets).map(item => {
                                return (
                                    <TableRow key={item} className={classes.list}>
                                        <TableCell><Typography>{tweets.tweets[item].email}</Typography></TableCell>
                                        <TableCell><Button size="small" color="primary" variant="contained" onClick={() => openModal(item)}>Show Details</Button></TableCell>
                                        <TableCell>
                                            <Switch 
                                                checked={tweets.tweets[item].approved}
                                                color="primary"
                                                onChange={(e) => handleChecked(item, e)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                            :
                            <TableRow style={{ textAlign: 'center' }}>
                                    <TableCell>
                                        <CircularProgress color="primary" />
                                    </TableCell>
                                </TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Modal open={open} className={classes.modal}>
                <div>
                    <Grid container>
                        <Grid item md={10} style={{ padding: '10px' }}>
                            <Typography variant="h4">Tweet Details</Typography>
                        </Grid>
                        <Grid item md={2}>
                            <IconButton onClick={() => setOpen(false)}>
                                <AiFillCloseCircle style={{ color: 'black', fontSize: 30 }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Typography color="primary" variant="body1">Message</Typography>
                    <TextField 
                        name="editableMessage"
                        onChange={handleChange}
                        value={message.editableMessage}
                        color="primary"
                        fullWidth
                        variant="outlined"
                        size="large" 
                    />
                    <br />
                    <br />
                    {loader ? <CircularProgress color="primary" style={{ color: 'white' }} />: <Button onClick={() => updateMessage()} fullWidth size="large" color="primary" variant="contained">Update</Button>}
                </div>  
            </Modal>
        </div>
    );
};
export default TweetsPanel;

const styles = makeStyles((theme) => ({
    root: {
        overflow: 'hidden',
        padding: theme.spacing(8),
        width: '60vw',
        position: 'relative'
    },
    table: {
        minWidth: 700
    },
    list: {
        maxHeight: '30vh',
        overflow: 'scroll',
        "&:hover": {
            backgroundColor: '#C19277'
        }
    },
    modal: {
        width: '40%',
        position: 'absolute',
        height: '30vh',
        top: '12%',
        left: '15%',
        margin: 'auto',
        padding: theme.spacing(10),
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        boxShadow: '10px 10px 4px #EEEEEE'
    },
    fabButton: {
        margin: 10
    },
    uploadContainer :{
        border: '3px dotted #2D2D2D',
        borderRadius: '10px',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        textAlign: 'center'
    },
    input: {
        display: "none"
    },
}))
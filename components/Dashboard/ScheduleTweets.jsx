import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, Snackbar,CircularProgress, TableCell, TableHead, TableBody, IconButton, Drawer, Grid, TextField, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiOutlineDelete, AiFillCloseCircle, AiOutlineDropbox } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';
import { MdDelete } from 'react-icons/md';
import { HiOutlinePencilAlt, HiUpload } from 'react-icons/hi';
import {tweetWithMedia, singleTweetApi} from '../../packages/api/tweetWithMedia';
import {FaDropbox} from 'react-icons/fa';
import MuiAlert from '@material-ui/lab/Alert';

const TweetsPanel = ({ email }) => {

    const [message, setMessage] = React.useState({
        message: "",
        editableMessage: "",
        createdAt: new Date(),
        currentId: null,
        fileData: null,
        fileName: null,
        file: null,
        storageImageUrl: null
    });

    const [tweets, setTweets] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    const [loader, setLoader] = React.useState(false);
    const [user, setUser] = React.useState(null);


    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setMessage(prevState => ({ ...prevState, [name]: value }));
    };
    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    }
   
 
    const fetchTweets = () => {
        setLoader(true);
        let dbRef = app.database().ref("tweets");
        dbRef.on("value", snap => {
            setTweets((prevState) => ({ ...prevState, tweets: snap.val() }));
            setLoader(false);
        });
    };

    const fetchUserFromFirebase = () => {
        app.auth().onAuthStateChanged(user => {
            if(user) {
                setUser({email: user.email, userId: user.uuid });
           }
        });
    };

    React.useEffect(() => {
        fetchTweets();
        fetchUserFromFirebase();
    }, [ ]);


    const handleDeleteScheduleTweet = (id) => {
        let dbRef = app.database().ref("tweets/" +  id);
        dbRef.remove().then((data) => console.log(data));
    }

    const openModal = (item) => {
        const value = tweets.tweets[item].message;
        const imageSource = tweets.tweets[item].fileSource;
        setMessage(prevState => ({ ...prevState, editableMessage: value, currentId: item, storageImageUrl: imageSource  }))
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

    
    const handlePostTweet = () => {
        const imageSource = tweets.tweets[message.currentId].fileSource;
        if(imageSource !== undefined){
            tweetWithMedia({ fileUrl: message.storageImageUrl, tweetMessage: message.editableMessage })
        }else {
            singleTweetApi(message.editableMessage);
        };
        let dbRef = app.database().ref("tweets/" +  message.currentId);
        dbRef.remove().then((data) => {
            setShow(true);
            setOpen(false);
            setSnackBarMessage("Tweet posted successfully")
            console.log(data);
        });
    };

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    const classes = useStyles();
    
    return (
        <div>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                severity="success"
                open={show}
                autoHideDuration={6000}
                onClose={() => setShow(false)}
                message={snackBarMessage}
                
            >
                <Alert>{snackBarMessage}</Alert>
            </Snackbar>
            <TableContainer className={classes.table}>
                <Table stickyHeader>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'rgba(134, 134, 134, 0.13)' }}>
                            <TableCell>
                                <Typography>Email</Typography>
                            </TableCell>
                            <TableCell align="center">
                                <Typography>Details</Typography>
                            </TableCell>
                            <TableCell align="center"> 
                                <Typography>Delete</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {tweets && tweets.tweets && Object.keys(tweets.tweets).length > 0 ? Object.keys(tweets.tweets).map(item => {
                            return (
                                <TableRow key={item}>
                                    <TableCell>
                                        <Typography>
                                            {tweets.tweets[item].email}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button 
                                            size="small" 
                                            className={classes.button}  
                                            color="primary" 
                                            variant="contained" 
                                            onClick={() => openModal(item)}
                                            startIcon={<HiOutlinePencilAlt />}
                                        >
                                            Show Details
                                        </Button>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDeleteScheduleTweet(item)}>
                                            <AiOutlineDelete style={{ color: '#C19277', fontSize: 30 }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })
                            :
                            <TableRow>
                                <TableCell style={{ textAlign: 'center' }}>
                                    <AiOutlineDropbox style={{ fontSize: 30 }} />
                                    <br />
                                    <Typography color="primary" variant="caption">No Tweets Found</Typography>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Grid container className={classes.detailsDrawer}>
                    <Grid item md={10} style={{ padding: '10px', borderBottom: '1px solid #EEEEEE' }}>
                        <Typography variant="h6">Tweet Detail</Typography>
                    </Grid>
                    <Grid item md={2}>
                        <IconButton onClick={() => setOpen(false)}>
                            <AiFillCloseCircle style={{ color: 'black', fontSize: 30 }} />
                        </IconButton>
                    </Grid>
                </Grid>
                <br />
                <br />
                <div className={classes.box}>
                    <Typography color="primary" variant="body1">Message</Typography>
                    <TextField 
                        name="editableMessage"
                        onChange={handleChange}
                        value={message.editableMessage}
                        color="primary"
                        fullWidth
                        variant="outlined"
                    />
                    <br />
                    <br />
                    {message.storageImageUrl !== null && message.fileName !== null && <img src={message.storageImageUrl} style={{ width: '100%', objectFit: 'contain', height: '70%'}} alt="Image" />}
                    {loader ? <CircularProgress color="primary" style={{ color: 'white' }} />: <Button onClick={() => updateMessage()} size="medium" fullWidth color="primary" variant="contained">Update</Button>}
                    <br />
                    <br />
                    <br />
                    <Button fullWidth>
                        <IconButton color="primary" onClick={() => handlePostTweet()}>
                            <HiUpload />
                        </IconButton>
                    </Button>
                </div>
            </Drawer>
        </div>
    );
};
export default TweetsPanel;


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        width: '20vw',
        padding: theme.spacing(4)
    },
    button: {
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)',
        textTransform: 'none'
    },
    detailsDrawer: {
        width: '40vw',
        padding: theme.spacing(2),
    },
    box: {
        border: '1px solid #EEEEEE',
        margin: theme.spacing(2),
        width: '90%',
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
        padding: theme.spacing(2),
        "&:hover": {
            boxShadow: '6px 6px 6px rgba(0, 0, 0, 0.25)',
            cursor: 'pointer'
        }
    },
    table: {
        height: '80vh',
        overflow: 'scroll',
    }
}))
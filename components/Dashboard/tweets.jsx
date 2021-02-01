import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography ,Table, TableContainer,Paper, TableBody, TableRow, TableCell, Fab, TableHead, Switch, Modal, Grid, CircularProgress, IconButton, Drawer } from '@material-ui/core';
import app from '../../utils/firebase';
import { AiFillCloseCircle, AiOutlineDelete, AiOutlineDropbox } from 'react-icons/ai';
import { FiCamera } from 'react-icons/fi';
import { postTweetApi } from '../../packages/api/postTweetApi';



const TweetsPanel = () => {

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
    const handleTweetButton = () => {
        let dbRef = app.database().ref("tweets");
        
        if(message.fileData){
        let storageRef = app.storage().ref(message.fileName);
        storageRef.put(message.file).then((snapshot) => {
            console.log(snapshot)
        }).catch((err) => console.log(err, 'error in uploading image'));
        app.storage().ref(message.fileName).getDownloadURL().then((url) => {
            dbRef.push({
                message: message.message,
                email: user ? user.email: "",
                createdAt: message.createdAt,
                approved: false,
                fileName: message.fileName,
                fileSource: url
            });
            setMessage(prevState => ({ ...prevState,  message: "" , storageImageUrl: url }));
            const formData = new FormData();
            // console.log(dataURItoBlob(url), 'dataURItoBlob(url)')
            formData.append("uploadedFile", url);
            console.log(formData, 'form data');
        }).catch((error) => {
            console.log('error in fetching image ', error)
            return
        });
        }else {
            dbRef.push({
                message: message.message,
                email: user ? user.email: "",
                createdAt: message.createdAt,
                approved: false,
                fileName: null,
                fileSource: null
            });
        }
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
    };

    React.useEffect(() => {
        fetchTweets();
        fetchUserFromFirebase();
    }, [ ]);


    const handleChecked = (id, e) => {
        const checked = e.target.checked;
        let dbRef = app.database().ref();
        let childRef = dbRef.child("tweets").child(id).child("approved");
        childRef.transaction((val) => {
            return !val;
        });
        const data = {
            status: tweets.tweets[id].message
        }
        postTweetApi(data);
    }

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

    const handleUploadClick = (event) => {
        event.preventDefault();
        const reader = new FileReader();
        const fileName = event.target.files[0].name;
        const file = event.target.files[0];

        reader.onload = () => {
            setMessage(prevState => ({ ...prevState, fileData:reader.result, fileName: fileName, file: file }));
        };
        console.log(event.target.files[0])
        reader.readAsDataURL(event.target.files[0]);
    };

    return (
        <div className={classes.root}>
             <Paper elevation={1} style={{ padding: '10px', borderRadius: 20 }}>
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
                    {/* <Grid item md={3}>
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
                    </Grid> */}
                </Grid>
                <Grid container>
                    <Grid item md={9} className={classes.uploadContainer}>
                        {message.fileData  !== null ?
                            <img style={{ objectFit: 'contain', width: '100%', height: '100%' }} src={message.fileData} alt="Upload Image" />
                        :
                        <>
                            <TextField
                                className={classes.input}
                                id="contained-button-file"
                                multiple
                                type="file"
                                variant="outlined" 
                                onChange={handleUploadClick}
                            />
                            <label htmlFor="contained-button-file">
                                <Fab color="primary" component="span" className={classes.fabButton}>
                                    <FiCamera />
                                </Fab>
                            </label>
                        </>}
                    </Grid>
                </Grid>
                <br />
                <br />
                    <Button 
                        size="large" 
                        color="primary" 
                        variant="contained" 
                        fullWidth
                        className={classes.button}
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
                                    <Typography>Approved</Typography>
                                </TableCell>
                                <TableCell align="right"> 
                                    <Typography>Delete</Typography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
                <br />
                <TableContainer>
                    <Table>
                        <TableBody>
                            {tweets && tweets.tweets && Object.keys(tweets.tweets).length === 0 && 
                                <AiOutlineDropbox />
                            }
                            {tweets && tweets.tweets && Object.keys(tweets.tweets).length > 0 ? Object.keys(tweets.tweets).map(item => {
                                return (
                                    <TableRow key={item} className={classes.list}>
                                        <TableCell><Typography>{tweets.tweets[item].email}</Typography></TableCell>
                                        <TableCell align="center"><Button size="small" color="primary" variant="contained" onClick={() => openModal(item)}>Show Details</Button></TableCell>
                                        <TableCell align="center">
                                            <Switch 
                                                checked={tweets.tweets[item].approved}
                                                color="primary"
                                                onChange={(e) => handleChecked(item, e)}
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton onClick={() => handleDeleteScheduleTweet(item)}>
                                                <AiOutlineDelete style={{ color: '#C19277', fontSize: 30 }} />
                                            </IconButton>
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
            {/* <Modal open={open} className={classes.modal}> */}
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Grid container className={classes.detailsDrawer}>
                    <Grid item md={10} style={{ padding: '10px' }}>
                        <Typography variant="h4">Tweet Detail</Typography>
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
                />
                <br />
                <br />
                {message.storageImageUrl !== null && message.fileName !== null && <img src={message.storageImageUrl} style={{ width: '100%', objectFit: 'contain', height: '70%'}} alt="Image" />}
                <br />
                <br />
                {loader ? <CircularProgress color="primary" style={{ color: 'white' }} />: <Button onClick={() => updateMessage()} fullWidth size="large" color="primary" variant="contained">Update</Button>}
            </Drawer>
            {/* </Modal> */}
        </div>
    );
};
export default TweetsPanel;

const styles = makeStyles((theme) => ({
    root: {
        overflow: 'hidden',
        padding: theme.spacing(8),
        width: '65vw',
        position: 'relative'
    },
    table: {
        minWidth: 700
    },
    list: {
        maxHeight: '30vh',
        overflow: 'scroll',
        "&:hover": {
            backgroundColor: '#EEEEEE'
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
        margin: 10,
        fontSize: 30
    },
    uploadContainer :{
        border: '3px dotted #2D2D2D',
        borderRadius: '10px',
        padding: theme.spacing(2),
        marginTop: theme.spacing(2),
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        display: "none",
    },
    button: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    detailsDrawer: {
        padding: theme.spacing(5)
    }
}))
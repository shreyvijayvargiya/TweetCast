import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography,Paper, TableHead, Grid, CircularProgress, IconButton, Fab } from '@material-ui/core';
import app from '../../utils/firebase';
import { AiFillCloseCircle } from 'react-icons/ai';
import { FiCamera } from 'react-icons/fi';
import { postTweetApi } from '../../packages/api/postTweetApi';
import { postMediaOnTwitterApi } from '../../packages/api/postMediaApi';

const TweetsPanel = () => {

    const [message, setMessage] = React.useState({
        message: "",
        editableMessage: "",
        createdAt: new Date(),
        currentId: null,
        fileData: null,
        fileName: null,
        file: null,
        storageImageUrl: null,
        
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
       
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
    
        return new Blob([ia], {type:mimeString});
    }
    const handleTweetButton = () => {
        setLoader(true);
        let dbRef = app.database().ref("tweets");
        
        if(message.fileData){
            let storageRef = app.storage().ref(message.fileName);
            storageRef.put(message.file).then((snapshot) => {
                console.log(snapshot)
            }).catch((err) => console.log(err, 'error in uploading image'));
            setTimeout(() => {
                app.storage().ref(message.fileName).getDownloadURL().then((url) => {
                    dbRef.push({
                        message: message.message,
                        email: user ? user.email: "",
                        createdAt: message.createdAt,
                        approved: false,
                        fileName: message.fileName,
                        fileSource: url
                    });
                    setMessage(prevState => ({ ...prevState,  message: "" , storageImageUrl: url, file: null, fileData
                :null, fileName: null }));
                    
                    const imgBlob = dataURItoBlob(url);
                    const file = new File([imgBlob], message.fileName, { type: 'image/png'});
                    postMediaOnTwitterApi(file);
                    setLoader(false);
                }).catch((error) => {
                    console.log('error in fetching image ', error)
                    setLoader(false);
                    return
                });
            }, 3000)
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
        setLoader(false);
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

    const handleUploadClick = (event) => {
        event.preventDefault();
        const reader = new FileReader();
        const fileName = event.target.files[0].name;
        const file = event.target.files[0];

        reader.onload = () => {
            setMessage(prevState => ({ ...prevState, fileData:reader.result, fileName: fileName, file: file }));
        };
        reader.readAsDataURL(event.target.files[0]);
    };

    
    return (
        <div className={classes.root}>
             <Paper elevation={1} style={{ padding: '10px', borderRadius: 8, backgroundColor: 'rgba(134, 134, 134, 0.13)',  boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)' }}>
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
                    {message.fileData  !== null ?
                        <Grid item md={9} className={classes.uploadContainer}>
                            <div className={classes.cancelButton}>
                                <IconButton color="primary" onClick={() => setMessage(prevState => ({...prevState, fileData: null, file: null, fileName: null}))}>
                                    <AiFillCloseCircle />
                                </IconButton>
                            </div>
                            <div className={classes.imgContainer}>
                                <img style={{ objectFit: 'contain', width: '100%', height: '100%' }} src={message.fileData} alt="Upload Image" />
                            </div>
                        </Grid>
                            :
                            <Grid item md={9} className={classes.uploadContainer}>
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
                            </Grid>
                        }
                </Grid>
                <br />
                <br />
                    <Button 
                        size="large" 
                        color="primary" 
                        variant="contained" 
                        className={classes.button}
                        onClick={() => handleTweetButton()}
                        disabled={(message.message).trim(" ").length >0 ? false: true}
                    >
                        {loader ? <CircularProgress color="primary" />:"Schedule Tweet"}
                    </Button>
            </Paper>
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
        padding: theme.spacing(1),
        marginTop: theme.spacing(2),
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    input: {
        display: "none",
    },
    button: {
        textTransform: 'none',
        width: '75%'
    },
    detailsDrawer: {
        padding: theme.spacing(5)
    },
    cancelButton: { 
        position: 'absolute',
        right: 0,
        top: 0,
        zIndex: 1
    },
    imgContainer: {
        widht: '20em',
        height: '20em'
    }
}))
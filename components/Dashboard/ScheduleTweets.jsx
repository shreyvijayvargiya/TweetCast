import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, CircularProgress, TableCell, TableHead, TableBody, IconButton, Drawer, Grid, TextField, Switch } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiOutlineDelete, AiFillCloseCircle } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';
import { MdDelete } from 'react-icons/md';

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
    const [checked, setChecked] = React.useState(false);
    const [loader, setLoader] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
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
        reader.readAsDataURL(event.target.files[0]);
    };

    const classes = useStyles();

    return (
        <div>
            <TableContainer>
                <Table>
                    <TableHead className={classes.table}>
                        <TableRow style={{ backgroundColor: 'rgba(134, 134, 134, 0.13)' }}>
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
        </div>
    );
};
export default TweetsPanel;


const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        width: '20vw',
        padding: theme.spacing(4)
    }
}))
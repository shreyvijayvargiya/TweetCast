import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Typography, Table, TableContainer, TableBody, TableRow, TableCell, TableHead, Switch, Modal, Grid, CircularProgress } from '@material-ui/core';
import { useRouter } from 'next/router';
import { Editor } from 'react-draft-wysiwyg';
// import { EditorState, convertToRaw } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
import app from '../../utils/firebase';
import { useSelector } from 'react-redux';

const TweetsPanel = () => {

    const [message, setMessage] = React.useState({
        message: "",
        editableMessage: "",
        createdAt: new Date(),
    });

    const [tweets, setTweets] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [checked, setChecked] = React.useState(false);
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
            approved: false
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


    const handleChecked = (id) => {
        let dbRef = app.database().ref();
        let childRef = dbRef.child("tweets").child(id).child("approved");
        childRef.transaction((val) => {
            return !val;
        });
    };

    return (
        <div className={classes.root}>
            <Typography variant="h6">Create Tweets</Typography>
            <br />
            <Grid container>
                <Grid item md={6}>
                    <TextField id="component-simple" 
                        placeholder="Enter Message" 
                        size="medium"  
                        color="primary" 
                        fullWidth
                        type="email"
                        type="text"
                        variant="outlined" 
                        className={styles.input}
                        name="message"
                        value={message.message}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={6}>
                    <TextField id="component-simple" 
                        placeholder="Select Date " 
                        size="medium"  
                        className={styles.input}
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
            <br />
            <div>
                {/* <Editor
                    editorState={editorState}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    onEditorStateChange={onEditorStateChange}
                /> */}
            </div>
            <br />
                <Button 
                    size="large" 
                    color="primary" 
                    variant="contained" 
                    fullWidth
                    onClick={() => handleTweetButton()}
                    disabled={(message.message).trim(" ").length >0 ? false: true}
                >
                    {/* <a target="_blank" href={url} style={{ color: message.message.trim(" ").length > 0 ? 'white': 'black', textDecoration: 'none' }}> */}
                       Schedule Tweet
                    {/* </a> */}
                </Button>
            <br />
            <br />
            <br />
            <br />
            <Typography>Scheduled Tweet</Typography>
            <br />
            <div>
                <TableContainer>
                    <Table>
                        <TableHead className={styles.table}>
                            <TableRow>
                                <TableCell>
                                    <Typography>Email</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>Details</Typography>
                                </TableCell>
                                <TableCell> 
                                    <Typography>Aprooved/Decline</Typography>
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
                                console.log(tweets.tweets[item])
                                return (
                                    <TableRow key={item} className={styles.list}>
                                        <TableCell><Typography>{tweets.tweets[item].email}</Typography></TableCell>
                                        <TableCell><Button size="small" color="primary" variant="text" onClick={() => setOpen(true)}>Show Details</Button></TableCell>
                                        <TableCell>
                                            <Switch 
                                                checked={tweets.tweets[item].approved}
                                                color="primary"
                                                onChange={() => handleChecked(item)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                            }):
                            <TableBody>
                                <TableRow style={{ textAlign: 'center' }}>
                                    <TableCell>
                                        <CircularProgress color="primary" />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        }
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Modal open={open} onClose={() => setOpen(false)} className={styles.modal}>
                <div>
                    <Grid container>
                        <Grid item md={6}>
                            <Typography>Tweet Details</Typography>
                        </Grid>
                        <Grid item md={6}>
                            <Switch 
                                checked={edit}
                                onChange={(e) => {
                                    const val = e.target.checked;
                                    setEdit(val)
                                }}
                                color="primary"
                            />
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Typography>Message</Typography>
                    <br />
                    <br />
                    <TextField 
                        name="editableMessage"
                        onChange={handleChange}
                        value={message.editableMessage}
                        color="primary"
                        variant="outlined"
                        size="large" 
                    />
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
        width: 700,
        position: 'relative'
    },
    table: {
        minWidth: 700
    },
    input:{
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1)
    },
    list: {
        maxHeight: '30vh',
        overflow: 'scroll'
    },
    modal: {
        width: '70%',
        position: 'absolute',
        top: '12%',
        left: '15%',
        margin: 'auto',
        textAlign: 'center',
        padding: theme.spacing(10)
    }
}))
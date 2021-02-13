import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, Drawer, TableCell, TableHead, TableBody, IconButton, Grid, TextField, Avatar, Snackbar, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { getSingleTweetApi, getSingleTweet } from '../../packages/api/getSingleTweet';
import { FaRegCommentDots } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import { AiFillCloseCircle, AiOutlineDropbox } from 'react-icons/ai';
import {useSelector} from 'react-redux';
import Link from 'next/link';
import MuiAlert from '@material-ui/lab/Alert';
import {postCommentMethod} from '../../packages/api/commentApi';
import { SignalCellular0Bar } from '@material-ui/icons';

const CommentsPanel = ({ setList, email }) => {
    
    const [comments, setComments] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [item, setItem] = React.useState(null);
    const [comment, setComment] = React.useState(null);
    const timelineData = useSelector(state => state.timelineData);
    const accessData = useSelector(state => state.accessData);

    const [show, setShow] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    
    const fetchScheduleCommentsTweetsFromFirebase = () => {
        let dbRef = app.database().ref("scheduledCommentsOnTweets");
        dbRef.on("value", snap => setComments(snap.val()));
    };
    
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };
    
    React.useState(() => {
        fetchScheduleCommentsTweetsFromFirebase();
    }, [ ]);
    
    const handleOpen = (id, commentId) => {
        setOpen(true);
        getSingleTweet(id).then((data) => {
            if(data){
                setItem(data.body)
            }else {
                setItem(null)
            }
        }).catch(error => {
            console.log(error);
            setItem(null)
        });
        let dbRef = app.database().ref("scheduledCommentsOnTweets/" +  commentId);
        dbRef.on("value",snap => {
            if(snap.val()){
                setComment(snap.val().comment);
            }
        });
    };
    
    const styles = useStyles();

    const handleDelete = (id) => {
        let dbRef = app.database().ref("scheduledCommentsOnTweets/" +  id);
        dbRef.remove().then((data) => console.log(data, 'scheduled comments removed'));
    };

    const handleUpdateCommentChange = (e) => {
        const val = e.target.val;
        setComment(val)
    };
    const handleUpdateComment = (commentId) => {
        let dbRef = app.database().ref();
        let childRef = dbRef.child("scheduledCommentsOnTweets/" + commentId).child(commentId).child("comment");
        childRef.transaction(() => { 
            setLoader(false);
            return comment 
        });
    };

    const handlePostComment = (id, tweetId) => {
        const message = comments[tweetId].comment;
        const username = comments[tweetId].username;
        const in_reply_to_status_id = comments[tweetId].in_reply_to_status_id;
        postCommentMethod(id, message, username,in_reply_to_status_id ).then((response) => {
            console.log(response, 'response');
            setShow(true);
            handleDelete(tweetId);
            setSnackBarMessage("Comment successfully");
        })
        .catch((error) => console.log('error', error));
    }
    
    
    return (
        <TableContainer>
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
            <Table>
                <TableHead>
                    <TableRow style={{ backgroundColor: 'rgba(134, 134, 134, 0.13)' }}>
                        <TableCell>
                            <Typography variant="body1">Email</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Show Details</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Comment</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Delete</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {comments && Object.keys(comments).length > 0 ? Object.keys(comments).map(item => {
                        return (
                            <TableRow key={item}>
                                <TableCell>{email}</TableCell>
                                <TableCell>
                                    <Button 
                                        className={styles.button} color="primary" 
                                        size="small" 
                                        starticon={<HiOutlinePencilAlt />}
                                        variant="contained" onClick={() => handleOpen(comments[item].tweetId, item)}>
                                        Show Details
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton disabled={accessData.dashboardAcccess ? false: true} onClick={() => handlePostComment(comments[item].tweetId, item)}>
                                        <FaRegCommentDots />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(item)}>
                                        <MdDelete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    })
                    :
                    <TableRow>
                        <TableCell>
                            <AiOutlineDropbox style={{ fontSize: 30 }} />
                            <br />
                            <Typography color="primary" variant="caption">No Comments Found</Typography>
                        </TableCell>
                    </TableRow>
                    }
                </TableBody>
            </Table>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}> 
                <div className={styles.root}>
                    <Grid container className={styles.detailsDrawer}>
                        <Grid item md={10} style={{ padding: '10px', borderBottom: '1px solid #EEEEEE' }}>
                            <Typography variant="h6">Tweet Detail</Typography>
                        </Grid>
                        <Grid item md={2}>
                            <IconButton onClick={() => setOpen(false)}>
                                <AiFillCloseCircle style={{ color: 'black', fontSize: 30 }} />
                            </IconButton>
                        </Grid>
                    </Grid>
                    {item && item.user && 
                        <div className={styles.box}>
                            <Grid container justify="flex-start">
                                <Grid>
                                    <IconButton>
                                        {item !== null && item.user !== null && item.user.url !== undefined && item.user.url !== null ? <Link target="_blank" href={item.user.url !== undefined && item.user.url}>
                                            <Avatar src={item.user.profile_image_url} />
                                        </Link>
                                            :
                                            <Avatar src={item.user.profile_image_url} />
                                        }
                                    </IconButton>
                                </Grid>
                                <Grid alignItems="center">
                                    <Typography variant="h6" style={{ marginTop: 18, marginLeft: 0 }}>{item.user.screen_name}</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Typography style={{ fontWeight: 800 }}>{item.text}</Typography>
                            {item.entities.urls.length > 0 && item.entities.urls.map(url => {
                                return (
                                    <Grid container> 
                                        <Grid item>
                                            <a href={url.url} target="_blank">{url.url}</a>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                            {item.entities.hashtags.length > 0 && item.entities.hashtags.map(hashtag => {
                                return (
                                    <Box> 
                                        <a href={hashtag.text} target="_blank">#{hashtag.text}</a>
                                    </Box>
                                )
                            })}
                            <br />
                            {item.entities.media !== undefined && item.entities.media.length > 0 && item.entities.media.map(media => {
                                return (
                                    <Box component="div" m={0}> 
                                        <img src={media.media_url} style={{ width: '80%' }} alt="Image" />
                                    </Box> 
                                )
                            })}
                        </div>
                    }
                    <div style={{ padding: 10 }}>
                        <label>Comment</label>
                        <br />
                        <TextField 
                            name="editableComment"
                            value={comment}
                            style={{ width: '60%', margin: 20 }}
                            variant="outlined"
                            onChange={handleUpdateCommentChange}
                        />
                        <br />
                        <Button style={{ width: '60%', margin: 20 }} color="primary" variant="contained" onClick={() => handleUpdateComment(item)}>Update</Button>
                    </div>
                </div>
            </Drawer>
        </TableContainer>
    );
};
export default CommentsPanel;


const useStyles = makeStyles((theme) => ({
    root: {
        width: '40vw',
    },
    button: {
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)',
        textTransform: 'none'
    },
    detailsDrawer: {
        padding: theme.spacing(2)
    },
    box: {
        border: '1px solid #EEEEEE',
        margin: theme.spacing(2),
        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
        padding: theme.spacing(2),
        "&:hover": {
            boxShadow: '6px 6px 6px rgba(0, 0, 0, 0.25)',
            cursor: 'pointer'
        }
    }
}))
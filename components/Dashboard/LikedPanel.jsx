import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, Avatar, TableCell, TableHead, TableBody, IconButton, Drawer, Grid, Link, Box, Snackbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { useDispatch } from 'react-redux';
import { AiTwotoneLike, AiFillCloseCircle, AiOutlineDropbox } from 'react-icons/ai';
import { getSingleTweetApi, getSingleTweet } from '../../packages/api/getSingleTweet';
import { getTimelineApi } from '../../packages/api/getTimelineApi';
import { MdDelete } from 'react-icons/md';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import { likeTweetApi, likeTweetMethod } from '../../packages/api/likeTweetApi';
import { useSelector } from 'react-redux';
import MuiAlert from '@material-ui/lab/Alert';
import { setTimelineInRedux } from '../../redux/action';

const LikedPanel = () => {

    const [likes, setLikes] = React.useState(null);
    const [likeTweet, setLikeTweet] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const { email, accessData, timelineData }  = useSelector(state => state);
    const dispatch = useDispatch()
    const [show, setShow] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");

    const fetchScheduleLikeTweetsFromFirebase = () => {
        let dbRef = app.database().ref("scheduledLikedOnTweets");
        dbRef.on("value", snap => setLikes(snap.val()));
    };
    
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };
    

    React.useState(() => {
        fetchScheduleLikeTweetsFromFirebase();
    }, [ ]);
    
    const handleOpen = (id) => {
        setOpen(true);
        getSingleTweet(id).then((response) => {
            if(response){
                setLikeTweet(response.body, 'response')
            }else {
                setLikeTweet(null)
            }
        }).catch((error) => console.log(error))
    };

    const styles = useStyles();

    const handleDelete = (id) => {
        let dbRef = app.database().ref("scheduledLikedOnTweets/" +  id);
        dbRef.remove().then((data) => console.log(data, 'liked schedule removed'));
    };
    const fetchTimlineAndStoreInRedux = () => {
        getTimelineApi().then(data => {
            dispatch(setTimelineInRedux(data.data.body.data));
        }).catch(error => console.log(error, 'error'))
    };

    const handleLikeTweet = (id, tweetId) => {
        likeTweetMethod(id).then((data) => {
            setShow(true);
            handleDelete(tweetId);
            setSnackBarMessage("Tweet liked successfully");
            fetchTimlineAndStoreInRedux()
        }).catch((error) => {
            console.log('error in liking tweeet', error);
        });
    };

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
            <Table stickyHeader>
                <TableHead>
                    <TableRow style={{ backgroundColor: '#EEEEEE', borderRadius: 8 }}>
                        <TableCell>
                            <Typography variant="body1">Email</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Show Details</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Like</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Delete</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {likes && Object.keys(likes).length > 0 ?  Object.keys(likes).map(item => {
                        return (
                            <TableRow key={item + 'id'}>
                                <TableCell>{email}</TableCell>
                                <TableCell>
                                    <Button 
                                        color="primary"  
                                        size="small" 
                                        variant="contained" 
                                        onClick={() => handleOpen(likes[item].tweetId)}
                                        className={styles.button}
                                        startIcon={<HiOutlinePencilAlt />}
                                    >
                                        Show Details
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton disabled={accessData.dashboardAcccess ? false: true} onClick={() => handleLikeTweet(likes[item].tweetId, item)}>
                                        <AiTwotoneLike />
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
                            <Typography color="primary" variant="caption">No Likes Found</Typography>
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
                    {likeTweet && likeTweet.user && 
                        <div className={styles.box}>
                            <Grid container justify="flex-start">
                                <Grid>
                                    <IconButton>
                                        {likeTweet !== null && likeTweet.user !== null && likeTweet.user.url !== undefined && likeTweet.user.url !== null ? <Link target="_blank" href={likeTweet.user.url !== undefined && likeTweet.user.url}>
                                            <Avatar src={likeTweet.user.profile_image_url} />
                                        </Link>
                                            :
                                            <Avatar src={likeTweet.user.profile_image_url} />
                                        }
                                    </IconButton>
                                </Grid>
                                <Grid alignItems="center">
                                    <Typography variant="h6" style={{ marginTop: 18, marginLeft: 0 }}>{likeTweet.user.screen_name}</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Typography style={{ fontWeight: 800 }}>{likeTweet.text}</Typography>
                            {likeTweet.entities.urls.length > 0 && likeTweet.entities.urls.map(url => {
                                return (
                                    <Grid container> 
                                        <Grid item>
                                            <a href={url.url} target="_blank">{url.url}</a>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                            {likeTweet.entities.hashtags.length > 0 && likeTweet.entities.hashtags.map(hashtag => {
                                return (
                                    <Box> 
                                        <a href={hashtag.text} target="_blank">#{hashtag.text}</a>
                                    </Box>
                                )
                            })}
                            <br />
                            {likeTweet.entities.media !== undefined && likeTweet.entities.media.length > 0 && likeTweet.entities.media.map(media => {
                                return (
                                    <Box component="div" m={0}> 
                                        <img src={media.media_url} style={{ width: '80%' }} alt="Image" />
                                    </Box> 
                                )
                            })}
                        </div>
                    }
                </div>
            </Drawer>
        </TableContainer>
    );
};
export default LikedPanel;


const useStyles = makeStyles((theme) => ({
    root: {
        width: '30vw',
        padding: theme.spacing(4),
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
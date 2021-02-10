import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Paper, Avatar, Grid, IconButton, Button, TextField, CircularProgress, Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { getTimeline } from '../../packages/api/getTimelineApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { FaRetweet } from 'react-icons/fa';
import app from '../../utils/firebase';
import { AiOutlineDropbox } from 'react-icons/ai';
import { setTimelineInRedux } from '../../redux/action';
import { useSelector } from 'react-redux';


const Timelines = () => {

    const classes = styles();
    const [tweetTimelineData, setTweetTimelineData] = React.useState(null);
    const [comment, setComment] = React.useState(null);
    const [showComment, setShowComment] = React.useState(false);
    const [currentId, setCurrentId] = React.useState("");
    const [show, setShow] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");

    const timelineData =  useSelector(state=> state.timelineData);
    
    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    };


    const fetchTweetTimeline = () => {
        setTweetTimelineData(timelineData);
    };
      
    React.useEffect(() => {
        fetchTweetTimeline();
    });

    const handleLikeTweet = (id, likedStatus) => {
        if(likedStatus){
            setShow(true);
            setSnackBarMessage("You have already liked this tweet");
        }else {
            let dbRef = app.database().ref("scheduledLikedOnTweets");
            dbRef.push({
                tweetId: id,
                date: new Date(),
            });
            setSnackBarMessage("Like scheduled successfully");
            setShow(true);
        }
    };
    const handleReTweet = (id) => {
        let dbRef = app.database().ref("scheduledRetweets");
        dbRef.push({
            tweetId: id,
            date: new Date(),
        });
        setSnackBarMessage("Retweet scheduled successfully");
        setShow(true);
    };
    const handleCommentOnTweet = (id, username, in_reply_to_status_id)=> {
        let dbRef = app.database().ref("scheduledCommentsOnTweets");
        console.log(in_reply_to_status_id, 'in_reply_to_status_id')
        dbRef.push({
            tweetId: id,
            comment: comment,
            date: new Date(),
            username: username,
            in_reply_to_status_id: in_reply_to_status_id
        });
        setComment("");
        setShowComment(false);
        setSnackBarMessage("Comment scheduled successfully");
        setShow(true);
    };


    const handleCommentChange = e => {
        const val = e.target.value;
        setComment(val);
    };
    const toggleCommentSection = (id) => {
        setShowComment(!showComment);
        setCurrentId(id)
    };

    return (
        <div className={classes.root}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={show}
                autoHideDuration={6000}
                onClose={() => setShow(false)}
            >
                <Alert>{snackBarMessage}</Alert>
            </Snackbar>
            <div className={classes.timeline}>
                {tweetTimelineData && tweetTimelineData.length > 0 ? tweetTimelineData.map(item => {
                    const urlLink = item.user.url;
                    const id = item.id_str;
                    const in_reply_to_status_id = item.id;
                    return (
                        <Paper key={item.id_str} elevation={2} className={classes.timelinePaper}>
                            <Grid container justify="flex-start">
                                <Grid>
                                    <IconButton>
                                        {urlLink !== undefined && urlLink !== null ? <Link target="_blank" href={urlLink !== undefined && urlLink}>
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
                                            <a href={url.url}>{url.url}</a>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                            {item.entities.hashtags.length > 0 && item.entities.hashtags.map(hashtag => {
                                return (
                                    <Box> 
                                        <a href={hashtag.text}>#{hashtag.text}</a>
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
                            <Grid container>
                                <Grid item md={2}>
                                    <IconButton onClick={() => handleLikeTweet(item.id_str, item.favorited)}>
                                        {item.favorited ? <AiFillHeart style={{ fill: 'rgb(224, 36, 94)' }} />:<AiOutlineHeart />}
                                    </IconButton>
                                </Grid>
                                <Grid item md={3}>
                                    <IconButton onClick={() => toggleCommentSection(id)}>
                                        <GoComment  />
                                    </IconButton>
                                </Grid>
                                <Grid item md={2}>
                                    <IconButton onClick={() => handleReTweet(id)}>
                                        <FaRetweet style={{ color: item.retweeted ?  'green': 'black' }} />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {showComment && currentId === item.id_str && 
                                <div style={{ width: '50%', margin: 'auto' }}>
                                    <TextField 
                                        name="comment"
                                        placeholder="Enter Comment"
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onChange={handleCommentChange}
                                        value={comment}
                                        fullWidth
                                    />
                                    <br />
                                    <br />
                                    <Button style={{ textTransform: 'none' }} color="primary" disabled={comment !== null && comment.trim(" ") <= 0 ? true: false} variant="contained" fullWidth onClick={() => handleCommentOnTweet(id, item.user.screen_name, in_reply_to_status_id)}>
                                        Schedule Comment
                                    </Button>
                                    <br />
                                </div>
                            }
                        </Paper>
                    )
                }):
                <Grid container>
                    <Grid item md={12} style={{ textAlign: 'center'}}>
                        <AiOutlineDropbox style={{ fontSize: 100 }} />
                        <br />
                        <Typography variant="caption" style={{ color: 'red' }}> Server is under maintainence, please try after some time</Typography>
                    </Grid>
                </Grid>
            }
            </div>
        </div>
    );
};
export default Timelines;


const styles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(4),
        position: 'relative',
        overflow: 'hidden',
        height: '90vh',
        paddingTop: theme.spacing(0),
        paddingLeft: theme.spacing(4),
        [theme.breakpoints.down('md')]: {
            padding: 0
        }
    },
    timeline: {
        width: '70vw',
        height: '90vh',
        overflow: 'scroll',
        border: '1px solid #EEEEEE',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        borderRadius: '4px',
        borderRadius: 8,
        [theme.breakpoints.down('md')]: {
            width: '90vw',
        }
    },
    header : {
        position: 'relative',
        right: 60,
        float: 'right',
        margin: theme.spacing(2),
    },
    timelinePaper: {
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
        padding: theme.spacing(2)
    }
}))
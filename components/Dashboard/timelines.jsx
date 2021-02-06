import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Paper, Avatar, Grid, IconButton, Button, TextField, CircularProgress } from '@material-ui/core';
import Head from 'next/head';
import { getTimelineApi, getTimeline } from '../../packages/api/getTimelineApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineHeart } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { FaRetweet } from 'react-icons/fa';
import app from '../../utils/firebase';
import { IoMdRefresh } from 'react-icons/io';
import { AiOutlineDropbox } from 'react-icons/ai';

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
};

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

const Timelines = () => {
    const classes = styles();
    const [tweetTimelineData, setTweetTimelineData] = React.useState(null);
    const [comment, setComment] = React.useState(null);
    const [showComment, setShowComment] = React.useState(false);
    const [currentId, setCurrentId] = React.useState("");
    const [value, setValue] = React.useState(0);
    const [loader, setLoader] = React.useState(false);
    const router = useRouter();
 
    const fetchTweetTimeline = () => {
        const timeline = getTimeline();
        if(timeline){
            setTweetTimelineData(timeline)
        }else {
            setTweetTimelineData(null)
        }
        setTimeout(() => {
            setLoader(false);
        }, 2000)
    };
      
    React.useEffect(() => {
        fetchTweetTimeline();
    }, [ loader ]);

    const handleRefresh = () => {
        setLoader(true);
        fetchTweetTimeline();
    };

    const handleLikeTweet = (id) => {
        let dbRef = app.database().ref("scheduledLikedOnTweets");
        dbRef.push({
            tweetId: id,
            date: new Date(),
        });
    };
    const handleReTweet = (id) => {
        let dbRef = app.database().ref("scheduledRetweets");
        dbRef.push({
            tweetId: id,
            date: new Date(),
        });
    };
    const handleCommentOnTweet = (id) => {
        let dbRef = app.database().ref("scheduledCommentsOnTweets");
        dbRef.push({
            tweetId: id,
            comment: comment,
            date: new Date(),
        });
        setComment("");
        setShowComment(false)
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
            <div className={classes.timeline}>
                {tweetTimelineData && tweetTimelineData.length > 0 ? tweetTimelineData.map(item => {
                    const urlLink = item.user.url;
                    return (
                        <Paper elevation={2} className={classes.timelinePaper}>
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
                                    <IconButton onClick={() => handleLikeTweet(item.id)}>
                                        <AiOutlineHeart />
                                    </IconButton>
                                </Grid>
                                <Grid item md={3}>
                                    <IconButton onClick={() => toggleCommentSection(item.id)}>
                                        <GoComment />
                                    </IconButton>
                                </Grid>
                                <Grid item md={2}>
                                    <IconButton onClick={() => handleReTweet(item.id)}>
                                        <FaRetweet />
                                    </IconButton>
                                </Grid>
                            </Grid>
                            {showComment && currentId === item.id && 
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
                                    <Button style={{ textTransform: 'none' }} color="primary" disabled={comment !== null && comment.trim(" ") <= 0 ? true: false} variant="contained" fullWidth onClick={() => handleCommentOnTweet(item.id)}>
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
    },
    timeline: {
        width: '70vw',
        height: '90vh',
        overflow: 'scroll',
        border: '1px solid #EEEEEE',
        padding: theme.spacing(2),
        margin: theme.spacing(2),
        borderRadius: '4px',
        // backgroundColor: 'rgba(134, 134, 134, 0.13)',
        borderRadius: 8,
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
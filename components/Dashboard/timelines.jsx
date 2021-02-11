import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Paper, Avatar, Grid, IconButton, Button, TextField, CircularProgress, Snackbar, Container } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab'
import MuiAlert from '@material-ui/lab/Alert';
import { getTimeline, getTimelineApi } from '../../packages/api/getTimelineApi';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { FaRetweet } from 'react-icons/fa';
import app from '../../utils/firebase';
import { AiOutlineDropbox } from 'react-icons/ai';
import { setTimelineInRedux } from '../../redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { searchTweet } from '../../packages/api/searchTweets';
import { followUser, unFollowUser } from '../../packages/api/followTweet';
import { searchUsersApi } from '../../packages/api/searchUsers';

const Timelines = () => {

    const classes = styles();
    const dispatch = useDispatch();
    const [tweetTimelineData, setTweetTimelineData] = React.useState(null);
    const [comment, setComment] = React.useState(null);
    const [search, setSearch]= React.useState("");
    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [searchUsers, setSearchUsers] = React.useState("");
    const [showComment, setShowComment] = React.useState(false);
    const [currentId, setCurrentId] = React.useState("");
    const [options, setOptions] = React.useState([]);
    const [show, setShow] = React.useState(false);
    const [snackBarMessage, setSnackBarMessage] = React.useState("");
    const [followState, setFollowState] = React.useState(true);

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

    const toggleFollowState = (state, id) => {
        setFollowState(!followState);
        if(state){
            followUser(id);
            getTimelineApi().then(data => {
                dispatch(setTimelineInRedux(data.data.body.data));
            }).catch(error => console.log(error, 'error'));
        }else {
            unFollowUser(id);
            getTimelineApi().then(data => {
                dispatch(setTimelineInRedux(data.data.body.data));
            }).catch(error => console.log(error, 'error'))
        };
    };

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

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        searchTweet(val).then(data => {
            if(data.data && data.data.body && data.data.body.data && data.data.body.data.statuses){
                dispatch(setTimelineInRedux(data.data.body.data.statuses))
            }else {
                setTweetTimelineData(null)
            }
        });
    };
    const handleSearchUsersChange = (e) => {
        setLoading(true);
        const val = e.target.value;
        searchUsersApi(val).then(data => {
            if(data.data && data.data.body && data.data.body.data){
                setOptions(data.data.body.data);
                setLoading(false);
                // dispatch(setTimelineInRedux(data.data.body.data))
            }else {
                setLoading(false);
                // setTweetTimelineData(null)
            }
        });
    };
    const handleSearchUserBlur = (e) => {
        const val = e.target.value;
        setSearchUsers(val);
        const newTimelineData = timelineData.filter(item => {
            console.log(item);
            if((item.name).toUppercase() === val.toUppercase()){
                return item
            };
        });
        console.log(newTimelineData)
        if(newTimelineData.length > 0){
            dispatch(setTweetTimelineData(newTimelineData));
        }
    }
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
            <Grid className={classes.search} justify="space-between" container>
                <Grid item md={7}>
                    <TextField 
                        name="search"
                        variant="outlined"
                        value={search}
                        style={{ margin: 10, backgroundColor: '#EEEEEE' }}
                        placeholder="Search tweet"
                        size="small"
                        onChange={handleSearchChange}
                        fullWidth

                    />
                </Grid>
                {/* <Grid item md={4} alignItems="center">
                    <Autocomplete
                        id="select-users"
                        style={{ width: 300 }}
                        open={open}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        onBlur={handleSearchUserBlur}
                        getOptionSelected={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => option.name}
                        options={options}
                        loading={loading}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                style={{ marginTop: 10, backgroundColor: '#EEEEEE' }}
                                onChange={handleSearchUsersChange}
                                label="Search users"
                                variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                    <React.Fragment>
                                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                        {params.InputProps.endAdornment}
                                    </React.Fragment>
                                    ),
                                }}
                            />
                        )}
                    />
                </Grid> */}
            </Grid>
            <div className={classes.timeline}>
                {tweetTimelineData && tweetTimelineData.length > 0 ? tweetTimelineData.map(item => {
                    const urlLink = item.user.url;
                    const id = item.id_str;
                    const in_reply_to_status_id = item.id;
                    const following = item.following;
                    return (
                        <Paper key={item.id_str} elevation={2} className={classes.timelinePaper}>
                            <Grid container justify="flex-start" alignItems="center">
                                <Grid item md={1}>
                                    <IconButton>
                                        {urlLink !== undefined && urlLink !== null ? <Link target="_blank" href={urlLink !== undefined && urlLink}>
                                            <Avatar src={item.user.profile_image_url} />
                                        </Link>
                                            :
                                            <Avatar src={item.user.profile_image_url} />
                                        }
                                    </IconButton>
                                </Grid>
                                <Grid alignItems="flex-start" md={8}>
                                    <Typography variant="h6" style={{ marginTop: 18, marginLeft: 0 }}>{item.user.screen_name}</Typography>
                                </Grid>
                                <Grid item md={1} alignItems="left">
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        style={{ textTransform: 'none' }}
                                        onClick={() => toggleFollowState(following, item.user.id_str)}
                                    >
                                        {following ? "UnFollow": "Following"}
                                    </Button>
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
                        <Typography variant="caption" style={{ color: 'red' }}> No timeline found</Typography>
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
    search: {
        width: '72vw',
        padding: theme.spacing(1),
        borderRadius: 10,
        border: '1px solid #EEEEEE',
        padding: '10px',
        margin: theme.spacing(2),
        [theme.breakpoints.down('md')]: {
            width: '90vw',
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
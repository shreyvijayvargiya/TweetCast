import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Paper, Avatar, Grid, IconButton, Button, TextField, CircularProgress, Snackbar, Container, Select, Menu, ListItem,ListItemIcon, ListItemText } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab'
import MuiAlert from '@material-ui/lab/Alert';
import { getTimeline, getTimelineApi } from '../../packages/api/getTimelineApi';
import { getSingleTweet } from '../../packages/api/getSingleTweet';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { GoComment } from 'react-icons/go';
import { FaRetweet } from 'react-icons/fa';
import app from '../../utils/firebase';
import { AiOutlineDropbox, AiOutlineLink } from 'react-icons/ai';
import { setTimelineInRedux , setSearchUserProfileInStore } from '../../redux/action';
import { useDispatch, useSelector } from 'react-redux';
import { searchTweet } from '../../packages/api/searchTweets';
import { followUser, unFollowUser } from '../../packages/api/followTweet';
import { searchUsersApi } from '../../packages/api/searchUsers';
import {getUserProfile} from '../../packages/api/getUserProfile';
import {AiFillCloseCircle} from 'react-icons/ai';
import { BsCalendar } from 'react-icons/bs';
import { IoLocationSharp } from 'react-icons/io5';



const Timelines = () => {

    const classes = styles();
    const dispatch = useDispatch();
    const [state, setState] = React.useState(true);
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
    const searchRef = React.useRef();
    
    const timelineData =  useSelector(state=> state.timelineData);
    const userProfileStore = useSelector(state => state.userProfile);
    const [userProfile, setUserProfile] = React.useState(userProfileStore);
    
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
        if(!state){
            followUser(id);
            getTimelineApi().then(data => {
                dispatch(setTimelineInRedux(data.data.body.data));
            }).catch(error => console.log(error, 'error'));
        }else {
            unFollowUser(id).then((response) => {
                if(response.data){
                    getTimelineApi().then(data => {
                        dispatch(setTimelineInRedux(data.data.body.data));
                    }).catch(error => console.log(error, 'error'))
                }
            }).catch((error) => console.log(error));
        };
    };
    const toggleFollowStateInSearch = (state, id, screen_name) => {
        if(!state){
            followUser(id).then((data) => {
                dispatch(setSearchUserProfileInStore(data.data.body.data))
            }).catch((error) => console.log(error, 'in following'));
        }else {
            unFollowUser(id).then((data) => {
                if(data){
                    dispatch(setSearchUserProfileInStore(data.data.body.data))
                }
            }).catch((error) => console.log(error));
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
        setState(true);
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
        const val = e.target.value;
        if(val.trim("").length ===0){
            setState(true);
            return
        };
        setSearchUsers(val);
        searchUsersApi(val).then(data => {
            if(data.data && data.data.body && data.data.body.data){
                setOptions(data.data.body.data);
                setLoading(false);
            }else {
                setLoading(false);
            }
        });
       
    };
   
    const handleUserSelected = (id, screen_name) => {
        setState(false);
        getUserProfile(screen_name).then((data) => {
            dispatch(setSearchUserProfileInStore(data.data.body.data));
        }).catch((error) => console.log(error, 'error'));
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
            {/* <Grid className={classes.search} justify="space-between" container>
                <Grid item md={7}>
                    <TextField 
                        name="search"
                        variant="outlined"
                        value={search}
                        style={{ margin: 10, backgroundColor: 'rgba(134, 134, 134, 0.05)' }}
                        placeholder="Search tweet"
                        size="small"
                        onChange={handleSearchChange}
                        fullWidth
                    />
                </Grid>
                <Grid item md={4} alignItems="center">
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
                        getOptionSelected={(option, value) => option.name === value.name }
                        getOptionLabel={(option) => option.name}
                        options={options}
                        handleHomeEndKeys={true}
                        loading={loading}
                        renderOption={(item) => (
                            <Grid container alignItems="center" style={{ padding: '10px' }} onClick={() => handleUserSelected(item.id, item.screen_name)}>
                                <Grid item alignItems="center">
                                    <Avatar src={item.profile_image_url} /> 
                                </Grid>
                                <Grid item alignItems="center">
                                   <Typography style={{ marginLeft: 10 }}>{item.name}</Typography>
                                </Grid>
                            </Grid>
                        )}
                        closeIcon={<AiFillCloseCircle onClick={() => setState(true) } />}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                ref={searchRef}
                                style={{ marginTop: 10, backgroundColor: 'rgba(134, 134, 134, 0.05)' }}
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
                </Grid>
            </Grid> */}
            {state ? 
            <div className={classes.timeline}>
                {tweetTimelineData && tweetTimelineData.length > 0 ? tweetTimelineData.map(item => {
                    const id = item.id_str;
                    const urlLink = item.user.url;
                    const in_reply_to_status_id = item.id;
                    const following = item.following;
                    return (
                        <Paper key={item.id_str} elevation={2} className={classes.timelinePaper}>
                            <Grid container justify="flex-start" alignItems="center">
                                <Grid item md={1} sm={1} lg={1} xs={3}>
                                    <IconButton>
                                        {urlLink !== undefined && urlLink !== null ? <Link target="_blank" href={urlLink !== undefined && urlLink}>
                                            <Avatar src={item.user.profile_image_url} />
                                        </Link>
                                            :
                                            <Avatar src={item.user.profile_image_url} />
                                        }
                                    </IconButton>
                                </Grid>
                                <Grid alignItems="flex-start" md={8} sm={8} lg={8} xs={5}>
                                    <Typography variant="h6" style={{ marginTop: 0, marginLeft: 0 }}>{item.user.screen_name}</Typography>
                                </Grid>
                                <Grid item md={1} sm={1} lg={1} xs={2} alignItems="flex-start">
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
                                        <FaRetweet style={{ color: item.retweeted &&  'green' }} />
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
            :
            <div className={classes.timeline}>
                {userProfile && (
                        <Paper key={userProfile.id_str} elevation={2} className={classes.timelinePaper}>
                            {userProfile.profile_banner_url && <div className={classes.profileBg}>
                                <img src={userProfile.profile_banner_url} style={{ objectFit: 'fill', width: '100%', height: '100%' }} />
                            </div>}
                            <Grid container justify="flex-start" alignItems="center">
                                <Grid item md={1}>
                                    <IconButton>
                                        <Avatar src={userProfile.profile_image_url} />
                                    </IconButton>
                                </Grid>
                                <Grid alignItems="flex-start" md={8}>
                                    <Typography variant="h6" style={{ marginTop: 0, marginLeft: 0 }}>{userProfile.screen_name}</Typography>
                                    <Typography variant="caption">{userProfile.description}</Typography>
                                </Grid>
                                <Grid item md={1} alignItems="flex-start">
                                    <Button 
                                        variant="outlined" 
                                        size="small"
                                        style={{ textTransform: 'none' }}
                                        onClick={() => toggleFollowStateInSearch(userProfile.following, userProfile.id_str, userProfile.screen_name)}
                                    >
                                        {userProfile.following ? "UnFollow": "Following"}
                                    </Button>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container spacing={3} justify="flex-start" alignItems="center" style={{ padding: 10 }}>
                                <Grid item>
                                    {userProfile.location && <Typography variant="body1"> <IoLocationSharp />{userProfile.location}</Typography>}
                                </Grid>
                                <Grid item>
                                    {userProfile.url && <a target="_blank" href={userProfile.url}><AiOutlineLink /> Website</a>}
                                </Grid>
                                <Grid item>
                                    {userProfile.location && <Typography variant="body1"><BsCalendar /> Joined  {userProfile.created_at.split(" ")[1]} { userProfile.created_at.split(" ")[5]}</Typography>}
                                </Grid>
                            </Grid>
                        </Paper>
                )}
            </div>}
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
            width: '88vw',
        }
    },
    timeline: {
        width: '70vw',
        overflow: 'scroll',
        height: '90vh',
        overflowY: 'scroll',
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
    },
    profileBg: {
        width: '100%',
        height: '40vh',

    }
}))
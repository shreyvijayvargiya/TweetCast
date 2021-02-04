import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, Avatar, TableCell, TableHead, TableBody, IconButton, Drawer, Grid, Link, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiTwotoneLike, AiFillCloseCircle } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';
import { MdDelete } from 'react-icons/md';
import {HiOutlinePencilAlt} from 'react-icons/hi';


const LikedPanel = ({ email }) => {

    const [likes, setLikes] = React.useState(null);
    const [likeTweet, setLikeTweet] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [item, setItem] = React.useState(null);

    const fetchScheduleLikeTweetsFromFirebase = () => {
        let dbRef = app.database().ref("scheduledLikedOnTweets");
        dbRef.on("value", snap => setLikes(snap.val()));
    };
    
    React.useState(() => {
        fetchScheduleLikeTweetsFromFirebase();
    }, [ ]);
    
    const handleOpen = (id) => {
        setOpen(true);
        const data = getSingleTweetApi(id);
        data.then((response) => {
            if(response){
                const dataArray = response;
                const singleTweet = dataArray.filter(item => { 
                    if(item.id === id) return item 
                });
                setLikeTweet(singleTweet[0]);
            }else{
                return null
            }
        }).catch(error => console.log(error, 'error'));
    };

    const styles = useStyles();

    const handleDelete = (id) => {
        let dbRef = app.database().ref("scheduledLikedOnTweets/" +  id);
        dbRef.remove().then((data) => console.log(data, 'liked schedule removed'));
    };

    return (
        <TableContainer>
            <Table>
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
                    {likes && Object.keys(likes).map(item => {
                        return (
                            <TableRow key={item}>
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
                                    <IconButton>
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
                    })}  
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
                    {likeTweet !== null && likeTweet.user !== null && 
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
                                <Grid alignIte="center">
                                    <Typography variant="h6" style={{ marginTop: 18, marginLeft: 0 }}>{likeTweet.user.screen_name}</Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Typography style={{ fontWeight: 800 }}>{likeTweet.text}</Typography>
                            {likeTweet.entities.urls.length > 0 && likeTweet.entities.urls.map(url => {
                                return (
                                    <Grid container> 
                                        <Grid item>
                                            <a href={url.url}>{url.url}</a>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                            {likeTweet.entities.hashtags.length > 0 && likeTweet.entities.hashtags.map(hashtag => {
                                return (
                                    <Box> 
                                        <a href={hashtag.text}>#{hashtag.text}</a>
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
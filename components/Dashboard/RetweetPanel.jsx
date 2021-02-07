import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Drawer, IconButton, Grid, Snackbar, Avatar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiOutlineRetweet, AiFillCloseCircle, AiOutlineDropbox } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';
import { MdDelete } from 'react-icons/md';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import { retweetApi } from '../../packages/api/retweetApi';
import { useSelector } from 'react-redux';
import Link from 'next/link';


const RetweetPanel = ({ email }) => {

    const [retweets, setRetweets] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [item, setItem] = React.useState(null);
    const [show, setShow] = React.useState(false);
    const [snackBarMessage, setSnackBarMesaage] = React.useState("");
    const timelineData = useSelector(state => state.timelineData);

    const fetchScheduleCommentsTweetsFromFirebase = () => {
        let dbRef = app.database().ref("scheduledRetweets");
        dbRef.on("value", snap => setRetweets(snap.val()));
    };
    
    React.useState(() => {
        fetchScheduleCommentsTweetsFromFirebase();
    }, [ ]);
    
    const handleOpen = (id) => {
        setOpen(true);
        const singleTweet = timelineData.filter(element => {
            if(element.id === id) return element
        });
        setItem(singleTweet[0]);
        // const data = getSingleTweetApi(id);
        // data.then((response) => {
        //     if(response){
        //         const dataArray = response;
        //         const singleTweet = dataArray.filter(item => { 
        //             if(item.id === id) return item 
        //         });
        //         setItem(singleTweet[0]);
        //     }else{
        //         return null
        //     }
        // }).catch(error => console.log(error, 'error'));
    };
    const styles = useStyles();

    const handleDelete = (id) => {
        let dbRef = app.database().ref("scheduledRetweets/" +  id);
        dbRef.remove().then((data) => console.log(data, 'retweet scheduled removed'));
    };

    const handleRetweetApi = (id) => {
        setShow(true)
        retweetApi(id);
        handleDelete(id);
        setOpen(false);
        setSnackBarMesaage("Retweeted successfullry");
    }
    return (
        <TableContainer>
            <Snackbar
                anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
                }}
                open={show}
                autoHideDuration={6000}
                onClose={() => setShow(false)}
                message={snackBarMessage}
                
            />
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
                            <Typography variant="body1">Retweet</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="body1">Delete</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {retweets && Object.keys(retweets).length > 0 ? Object.keys(retweets).map(item => {
                        return (
                            <TableRow key={item}>
                                <TableCell>{email}</TableCell>
                                <TableCell>
                                    <Button className={styles.button} 
                                        color="primary" 
                                        startIcon={<HiOutlinePencilAlt />}
                                        size="small" variant="contained" onClick={() => handleOpen(retweets[item].tweetId)}>
                                        Show Details
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleRetweetApi(item)}>
                                        <AiOutlineRetweet />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(item)}>
                                        <MdDelete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )
                    }):
                    <TableRow style={{ width: 700 }}>
                        <TableCell style={{ textAlign: 'center' }}>
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
                    {item && item.user !== null && 
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
                        </div>
                    }
                </div>
            </Drawer>
        </TableContainer>
    );
};
export default RetweetPanel;

const useStyles = makeStyles((theme) => ({
    root: {
        width: '30vw',
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

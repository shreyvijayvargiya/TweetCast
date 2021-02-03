import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, TableCell, TableHead, TableBody, Drawer, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiOutlineRetweet } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';
import { MdDelete } from 'react-icons/md';
import {HiOutlinePencilAlt} from 'react-icons/hi';

const RetweetPanel = ({ email }) => {

    const [retweets, setRetweets] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [item, setItem] = React.useState(null);

    const fetchScheduleCommentsTweetsFromFirebase = () => {
        let dbRef = app.database().ref("scheduledRetweets");
        dbRef.on("value", snap => setRetweets(snap.val()));
    };
    
    React.useState(() => {
        fetchScheduleCommentsTweetsFromFirebase();
    }, [ ]);
    
    const handleOpen = (id) => {
        setOpen(true);
        const data = getSingleTweetApi(id);
        console.log(data);
    };
    const styles = useStyles();

    const handleDelete = (id) => {
        let dbRef = app.database().ref("scheduledRetweets/" +  id);
        dbRef.remove().then((data) => console.log(data, 'retweet scheduled removed'));
    };

    return (
        <TableContainer>
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
                    {retweets && Object.keys(retweets).map(item => {
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
                                    <IconButton>
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
                    })}  
                </TableBody>
            </Table>
            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}> 
                <div className={styles.root}>
                {item !== null && item.user !== null && 
                    <div>
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
        height: '20vh',
    },
    button: {
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)',
        textTransform: 'none'
    }
}))
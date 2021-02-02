import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, Avatar, TableCell, TableHead, TableBody, IconButton, Drawer, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiTwotoneLike } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';

const LikedPanel = ({ email }) => {

    const [likes, setLikes] = React.useState(null);
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
        console.log(data);
    };
    const styles = useStyles();
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <Typography variant="h6">Email</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h6">Show Details</Typography>
                        </TableCell>
                        <TableCell>
                            <Typography variant="h6">Like</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {likes && Object.keys(likes).map(item => {
                        return (
                            <TableRow key={item}>
                                <TableCell>{email}</TableCell>
                                <TableCell>
                                    <Button color="primary" size="small" variant="outlined" onClose={() => handleOpen(item)}>
                                        Show Details
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <IconButton>
                                        <AiTwotoneLike />
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
export default LikedPanel;


const useStyles = makeStyles((theme) => ({
    root: {
        height: '20vh',
        
    }
}))
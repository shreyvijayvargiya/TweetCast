import React from 'react';
import { Button, Typography, TableContainer, Table, TableRow, Avatar, TableCell, TableHead, TableBody, IconButton, Drawer, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import app from '../../utils/firebase';
import { AiTwotoneLike, AiFillCloseCircle } from 'react-icons/ai';
import { getSingleTweetApi } from '../../packages/api/getSingleTweet';
import { MdDelete } from 'react-icons/md';
import {HiOutlinePencilAlt} from 'react-icons/hi';


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
        data.then((response) => {
            if(response){
                const dataArray = response.data;
                const singleTweet = dataArray.filter(item => { if(item.id === id) return item });
                console.log(singleTweet);
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
                        <Grid item md={10} style={{ padding: '10px' }}>
                            <Typography variant="h6">Tweet Detail</Typography>
                        </Grid>
                        <Grid item md={2}>
                            <IconButton onClick={() => setOpen(false)}>
                                <AiFillCloseCircle style={{ color: 'black', fontSize: 30 }} />
                            </IconButton>
                        </Grid>
                    </Grid>
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
        width: '30vw',
        padding: theme.spacing(4),
    },
    button: {
        boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.25)',
        textTransform: 'none'
    },
    detailsDrawer: {
        padding: theme.spacing(5)
    },
}))
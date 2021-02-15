import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { GrSchedules } from 'react-icons/gr';
import { MdTimeline } from 'react-icons/md';
import { MdNextWeek } from 'react-icons/md';
import { RiLogoutCircleRLine, RiAdminLine } from 'react-icons/ri';
import { removeCookie } from '../../utils/cookie';
import app from '../../utils/firebase';
import { useSelector } from 'react-redux';
import { IoCreate } from 'react-icons/io5';


const Sidebar = () => {
    
    const classes = style();
    const router = useRouter();
    const accessData = useSelector(state =>  state.accessData);

    const handleClick = (query) => {
        router.push({ pathname: 'dashboard', query: { type: query} });
    };
    
    const handleLogout = () => {
        removeCookie('uid');
        app.auth().signOut();
        router.push('/login')
    };

    console.log(accessData)

    return (
        <div className={classes.root}>
            <Typography variant="h6" className={classes.title} onClick={() => router.push('/')}>
                TweetCast
            </Typography>
            <br />
            <List style={{  width: '100%', height: '100vh', position:'relative' }}>
                {accessData && accessData.userType === 'admin' && 
                    <ListItem className={classes.listItem}>
                        <ListItemIcon>
                            <RiAdminLine color="primary" />
                        </ListItemIcon>
                        <Button className={classes.button} onClick={() => handleClick('admin')} fullWidth variant={router.query.type === 'admin' ? 'contained': 'text'} size="small" color="primary" >
                            Admin
                        </Button>
                    </ListItem>
                }
                <ListItem className={classes.listItem}>
                    <ListItemIcon>
                        <IoCreate />
                    </ListItemIcon>
                    <Button className={classes.button} onClick={() => handleClick('tweets')} fullWidth variant={router.query.type === 'tweets' ? 'contained': 'text'} size="small" color="primary">Create tweet</Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemIcon>
                        <MdTimeline />
                    </ListItemIcon>
                    <Button className={classes.button} onClick={() => handleClick('timelines')} variant={router.query.type === 'timelines' ? 'contained': 'text'} size="small"  color="primary" fullWidth>Timelines</Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <ListItemIcon>
                        <GrSchedules />
                    </ListItemIcon>
                    <Button className={classes.button} onClick={() => handleClick('scheduledTweetsActions')} variant={router.query.type === 'scheduledTweetsActions' ? 'contained': 'text'} size="small"  color="primary" fullWidth>Scheduled Actions</Button>
                </ListItem>
                <div style={{ position: 'absolute', width: '100%', bottom: 20 }}>
                    <ListItem className={classes.logout}>
                        <ListItemIcon>
                            <RiLogoutCircleRLine />
                        </ListItemIcon>
                        <Button onClick={() => handleLogout()} size="small" variant="text" color="primary" fullWidth>Logout</Button>
                    </ListItem>
                </div>
            </List>
        </div>
    );
};
export default Sidebar;


const style = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'start',
        alignItems: 'center',
        borderRight: '1px solid rgba(134, 134, 134, 0.13)',
        height: '100vh',
        borderRadius: 0,
        minWidth: '16vw',
        padding: theme.spacing(2),
        overflow: 'hidden',
        backgroundColor: 'rgba(134, 134, 134, 0.05)',
        // boxShadow: '4px 4px 4px rgba(129, 129, 129, 0.5)',
        // "&:hover ": {
        //     boxShadow: '5px 5px 3px rgba(129, 129, 129, 0.5)',
        // }
    },
    button : {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        width: '100%',
        textTransform: 'none'
    },

    listItem: {
        width: '100%',
        padding: 0
    },
    logout: {
        position: 'absolute',
        bottom: '0px'
    }
}))
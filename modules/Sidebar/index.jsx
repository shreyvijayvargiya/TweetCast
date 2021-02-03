import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem } from '@material-ui/core';
import { useRouter } from 'next/router';
import { RiAdminLine } from 'react-icons/ri';
import { GrSchedules } from 'react-icons/gr';
import { MdTimeline } from 'react-icons/md';
import { MdNextWeek } from 'react-icons/md';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { removeCookie } from '../../utils/cookie';

const Sidebar = () => {
    
    const classes = style();
    const router = useRouter();

    const handleClick = (query) => {
        router.push({ pathname: 'dashboard', query: { type: query} });
    };
    
    const handleLogout = () => {
        removeCookie('uid');
        removeUserFromStore()
        app.auth().signOut();
        router.push('/login')
      };
    return (
        <div className={classes.root}>
            <br />
            <List style={{  width: '100%' }}>
                <ListItem className={classes.listItem}>
                    <Button startIcon={<RiAdminLine />} className={classes.button} onClick={() => handleClick('admin')} fullWidth variant={router.query.type === 'admin' ? 'contained': 'text'} size="large" color="primary" >
                        Admin
                    </Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Button startIcon={<MdNextWeek />} className={classes.button} onClick={() => handleClick('tweets')} fullWidth variant={router.query.type === 'tweets' ? 'contained': 'text'} size="large" color="primary">Create tweet</Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Button startIcon={<MdTimeline />} className={classes.button} onClick={() => handleClick('timelines')} variant={router.query.type === 'timelines' ? 'contained': 'text'} size="large"  color="primary" fullWidth>Timelines</Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Button className={classes.button} startIcon={<GrSchedules />} onClick={() => handleClick('scheduledTweetsActions')} variant={router.query.type === 'scheduledTweetsActions' ? 'contained': 'text'} size="large"  color="primary" fullWidth>Scheduled Actions</Button>
                </ListItem>
            </List>
            <div style={{ height: '60vh', position: 'relative', width: '100%' }}>
                <Button startIcon={<RiLogoutCircleRLine />} className={classes.logoutButton} onClick={() => handleLogout()} variant="text" color="primary" fullWidth>Logout</Button>
            </div>
        </div>
    );
};
export default Sidebar;


const style = makeStyles((theme) => ({
    root: {
        backgroundColor: 'rgba(134, 134, 134, 0.13)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'start',
        alignItems: 'center',
        top: '2%',
        bottom: '10px',
        borderRadius: 20,
        padding: theme.spacing(2),
        overflow: 'hidden',
        minWidth: '16vw',
        boxShadow: '4px 4px 4px rgba(129, 129, 129, 0.5)'
    },
    button : {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginTop: theme.spacing(1),
        width: '100%',
        textTransform: 'none'
    },
    logoutButton: {
        position: 'absolute',
        bottom: '10px',
        left: '0px',
        right: '0px'
    },
    listItem: {
        width: '100%',
        padding: 0
    }
}))
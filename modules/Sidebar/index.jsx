import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, List, ListItem } from '@material-ui/core';
import { useRouter } from 'next/router';
import app from '../../utils/firebase';

const Sidebar = () => {
    
    const classes = style();
    const router = useRouter();

    const handleClick = (query) => {
        router.push({ pathname: 'dashboard', query: { type: query} });
    };
    
   
    return (
        <div className={classes.root}>
            <br />
            <List style={{  width: '100%' }}>
                <ListItem className={classes.listItem}>
                    <Button className={classes.button} onClick={() => handleClick('admin')} fullWidth variant={router.query.type === 'admin' ? 'contained': 'text'} color="primary" >Admin</Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Button className={classes.button} onClick={() => handleClick('tweets')} fullWidth variant={router.query.type === 'tweets' ? 'contained': 'text'} color="primary">Tweets</Button>
                </ListItem>
                <ListItem className={classes.listItem}>
                    <Button className={classes.button} onClick={() => handleClick('timelines')} variant={router.query.type === 'timelines' ? 'contained': 'text'} color="primary" fullWidth>Timelines</Button>
                </ListItem>
                {/* <ListItem className={classes.listItem}>
                    <Button className={classes.button} onClick={() => handleClick('team')} variant={router.query.type === 'team' ? 'contained': 'text'} color="primary" fullWidth>Team</Button>
                </ListItem> */}
            </List>
            {/* <div className={classes.logoutButton}>
                <ListItem>
                    <Button className={classes.logout} onClick={() => handleLogout()} color="primary" variant="outlined" fullWidth>Logout</Button>
                </ListItem>
            </div> */}
        </div>
    );
};
export default Sidebar;


const style = makeStyles((theme) => ({
    root: {
        backgroundColor: '#F9F9F9',
        display: 'flex',
        flexDirection: 'column',
        justifyContent:'start',
        alignItems: 'center',
        position: 'fixed',
        top: '8%',
        bottom: 0,
        paddingTop: theme.spacing(0),
        overflow: 'hidden',
        width: '18%'
    },
    button : {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
        borderRadius: 0,
        width: '100%',
    },
    logoutButton: {
        position: 'absolute',
        bottom: '10px',
    },
    listItem: {
        width: '100%',
        padding: 0
    }
}))
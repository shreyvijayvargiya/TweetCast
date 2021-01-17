import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider, Tabs, Tab, Box, AppBar } from '@material-ui/core';
import axios from 'axios';
import Head from 'next/head';
import { Timeline } from 'react-twitter-widgets'

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
};

const Timelines = () => {
    const classes = styles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    
    return (
        <div className={classes.root}>
            <Head>
                <script src="https://platform.twitter.com/widgets.js"></script>
            </Head>
            <div className={classes.header}>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                        <Tab label="Profile" {...a11yProps(0)} />
                        <Tab label="Collection" {...a11yProps(1)} />
                        <Tab label="List" {...a11yProps(2)} />
                    </Tabs>
                </AppBar>
            </div>
            <div className={classes.timeline}>
                <TabPanel value={value} index={0}>
                   <Timeline 
                        dataSource={{
                            sourceType: 'profile',
                            screenName: 'treyvijay'
                        }}
                   />
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Timeline
                        dataSource={{ sourceType: "collection", id: "393773266801659904" }}
                    />
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Timeline
                        dataSource={{
                        sourceType: "list",
                        ownerScreenName: "twitter",
                        id: "214727905"
                        }}
                    />
                </TabPanel>
            </div>
        </div>
    );
};
export default Timelines;


const styles = makeStyles((theme) => ({
    root: {
        height: '80vh',
        padding: theme.spacing(4),
        position: 'relative',
        overflow: 'hidden'
    },
    timeline: {
        width: '60vw',
        minHeight: '80vh',
        maxHeight: '80vh',
        overflow: 'scroll',
        position: "relative",
        top: '8%',
        border: '1px solid #EEEEEE',
        borderRadius: '4px'
    },
    header : {
        position: "fixed",
        width: '60vw'
    }
}))
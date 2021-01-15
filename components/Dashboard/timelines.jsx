import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Divider } from '@material-ui/core';
import axios from 'axios';
import Head from 'next/head';

const Timelines = () => {
    const classes = styles();
    const [tweetsData, setTweetsData] = React.useState(null);

    const fetchData = async () => {
        const name = "treyvijay";
        const count = 10;
        const result = await axios.get(`https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=${name}&count=${count}`, {
            header: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        setTweetsData(result.data);
    };
    
    React.useEffect(() => {
        // fetchData()
        console.log(tweetsData)
    }, [])

    return (
        <div className={classes.root}>
            <Head>
                <script src="https://platform.twitter.com/widgets.js"></script>
            </Head>
            <div>
                <Typography variant="h6">Timelines</Typography>
            </div>
            <Divider />
            <br />
            <div className={classes.timeline}>
                <a className="twitter-timeline" href="https://twitter.com/treyvijay?ref_src=twsrc%5Etfw">Tweets by treyvijay</a>
            </div>
        </div>
    );
};
export default Timelines;


const styles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        padding: theme.spacing(8)
    },

    timeline: {
        width: '50vw',
        maxHeight: '80vh',
        overflow: 'scroll'
    }
}))
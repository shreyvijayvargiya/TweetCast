import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const Timelines = () => {
    const classes = styles();
    return (
        <div className={classes.root}>
            <Typography variant="h6">Timelines</Typography>
            <a className="twitter-timeline" data-lang="en" data-width="600" href="https://twitter.com/TwitterDev/lists/national-parks?ref_src=twsrc%5Etfw">A Twitter List by TwitterDev</a> <script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
        </div>
    );
};
export default Timelines;


const styles = makeStyles((theme) => ({
    root: {
        height: '90vh',
        overflow: 'hidden',
        padding: theme.spacing(8)
    }
}))
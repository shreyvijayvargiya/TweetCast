import React from 'react';
import { Grid, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Sidebar } from '../../modules';
import { useRouter } from 'next/router';
import TweetsPanel from './tweets';
import AdminPanel from './admin';
import Timelines from './timelines';
import TeamPanel from './team';
import ScheduledTweetsActions from './ScheduledTweetsActions';
import {getTimelineApi} from '../../packages/api/getTimelineApi';
import {useDispatch} from 'react-redux';
import {setTimelineInRedux} from '../../redux/action';

const Dashboard = () => {
    
    const router = useRouter();
    const type = router.query.type;
    const dispatch = useDispatch();

    const Panel = () => {
        if(type === 'admin') return <AdminPanel />
        else if(type === 'tweets') return <TweetsPanel />
        else if(type === 'timelines') return <Timelines />
        else if(type === 'team') return <TeamPanel />
        else if(type === 'scheduledTweetsActions') return <ScheduledTweetsActions />
        else return <AdminPanel />
    };
    const styles = useStyles(); 

    const fetchTimlineAndStoreInRedux = () => {
        getTimelineApi().then(data => {
            dispatch(setTimelineInRedux(data.data.body.data));
        }).catch(error => console.log(error, 'error'))
    }

    React.useEffect(() => {
        fetchTimlineAndStoreInRedux();
    }, []);

    return (
        <Grid container className={styles.root} spacing={2}>
            <Grid item md={2}>
                <Sidebar />
            </Grid>
            <Grid item md={10}>
                <div className={styles.panel}>
                    <Panel />
                </div>
            </Grid>
        </Grid>
    );
};
export default Dashboard;


const useStyles = makeStyles(theme => ({
    buttonContainer : {
        position: 'absolute',
        right: '20px',
        top: '0px'
    },
    root: {
        position: 'relative',
        overflow: 'hidden',
    },
    panel: {
        overflow: 'scroll',
        height: '90vh',
    }
}))
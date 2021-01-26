import React from 'react';
import { Sidebar } from '../../modules';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import TweetsPanel from './tweets';
import AdminPanel from './admin';
import Timelines from './timelines';
import TeamPanel from './team';
import app from '../../utils/firebase';
import { setUserInStore } from '../../redux/action';
import { useDispatch } from 'react-redux';

const Dashboard = () => {
    
    const router = useRouter();
    const type = router.query.type;

    const Panel = () => {
        if(type === 'admin') return <AdminPanel />
        else if(type === 'tweets') return <TweetsPanel />
        else if(type === 'timelines') return <Timelines />
        else if(type === 'team') return <TeamPanel />
        else return <AdminPanel />
    };
   
    return (
        <Grid container>
            <Grid item md={2}>
                <Sidebar />
            </Grid>
            <Grid item>
                <Panel />
            </Grid>
        </Grid>
    );
};
export default Dashboard;

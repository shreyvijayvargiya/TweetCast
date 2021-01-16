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

const Dashboard = () => {
    
    const classes = styles();
    const router = useRouter();

    const type = router.query.type;

    const Panel = () => {
        if(type === 'admin') return <AdminPanel />
        else if(type === 'tweets') return <TweetsPanel />
        else if(type === 'timelines') return <Timelines />
        else if(type === 'team') return <TeamPanel />
        else return <AdminPanel />
    };
    React.useEffect(() => {
        app.database().ref("users").on("value", (snap) => console.log(snap.value))
    }, [])
    return (
        <Grid container>
            <Grid item xl={3} md={2}>
                <Sidebar />
            </Grid>
            <Grid item xl={8}>
                <Panel />
            </Grid>
        </Grid>
    );
};
export default Dashboard;

const styles = makeStyles((theme) => ({
    
}))
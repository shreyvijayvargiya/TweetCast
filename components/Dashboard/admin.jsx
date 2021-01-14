import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, Snackbar, Paper, Grid, TextField, Switch } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import app from '../../utils/firebase';
import { v4 as uuidv4 } from 'uuid';

const AdminPanel = () => {
    const classes = styles();
    const [email, setEmail] = React.useState("");
    const [users, setUsers] = React.useState(null);
    const [disabled, setDisabled] = React.useState(false);
    const [message, setMessage] = React.useState(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    };
    
    const handleSwitchChange = (id) => {
        let dbRef = app.database().ref();
        let childRef = dbRef.child("users").child(id).child("dashboardAcccess");
        childRef.transaction((val) => {
            return !val;
        });
    };

    const handleSendInvitation = () => {
        let dbRef = app.database().ref("users");
        const id = uuidv4();
        Object.keys(users.users).map(item => {
            if(users.users[item].email === email){
                setDisabled(true);
                setMessage("Email already exist");
            }else {
                dbRef.push({
                    email,
                    dashboardAcccess: true,
                    userType: 'staff'
                });
                setEmail("");
                setMessage("Invitation sent successfully");
            }
        });
    };
    React.useEffect(() => {
        let dbRef = app.database().ref("users");
        dbRef.on("value", snap => setUsers((prevState) => ({ ...prevState, users: snap.val() })));
    }, [ ]);

    return (
        <div className={classes.root}>
           <Typography variant="h5">Admin Account</Typography>
           <br />
           <Typography variant="h6">Invite users</Typography>
           <br />
           <TableContainer>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ border: 'none' }}>
                                {message && <label>{message}</label>}
                                <TextField id="component-simple" 
                                    placeholder="Enter email" 
                                    size="small"  
                                    color="primary" 
                                    fullWidth
                                    type="email"
                                    variant="outlined" 
                                    name="email" 
                                    value={email}
                                    onChange={handleChange}
                                />
                            </TableCell>
                            <TableCell align="right" style={{ border: 'none' }}>
                                <Button disabled={email.trim(" ").length > 0 ? false: true || disabled} onClick={() => handleSendInvitation()} color="primary" variant="contained">Send Invitation</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
           </TableContainer>
           <br />
           <br />
           <br />
           <br />
           <TableContainer component={Paper}>
                <Table aria-label="simple table" className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="body1">Email</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body1">Access</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className={classes.list}>
                        {users && users.users && Object.keys(users.users).map(item => {
                            return (
                                <TableRow key={item}>
                                    <TableCell>
                                        {users.users[item].email}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Switch
                                            checked={users.users[item].dashboardAcccess}
                                            onChange={() => handleSwitchChange(item)}
                                            name={item.id}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
           </TableContainer>
        </div>
    );
};
export default AdminPanel;


const styles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        width: '100%',
        overflow: 'scroll',
        padding: theme.spacing(8)
    },
    paper: {
        padding: theme.spacing(2)
    },
    table: {
        minWidth: 700
    },
    list: {
        maxHeight: '30vh',
        overflow: 'scroll'
    }
}));
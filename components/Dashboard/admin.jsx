import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Button, IconButton, Paper, Grid, TextField, Switch, Select, MenuItem } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import app from '../../utils/firebase';
import { AiOutlineDelete } from 'react-icons/ai';


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

    const handleUserType = (e, id) => {
        const val = e.target.value;
        let dbRef = app.database().ref();
        let childRef = dbRef.child("users").child(id).child("userType");
        childRef.transaction(() => {
            console.log(val, 'val');
            return val;
        });
    };

    const handleDelete = (id) => {
        let dbRef = app.database().ref("users/" +  id);
        dbRef.remove().then((data) => console.log(data));
    }

    const handleSendInvitation = () => {
        let dbRef = app.database().ref("users");
        // Object.keys(users.users).map(item => {
        //     if(users.users[item].email === email){
        //         setDisabled(true);
        //         setMessage("Email already exist");
        //     }else {
        //         setMessage("Invitation sent successfully");
        //     }
        // });
        dbRef.push({
            email,
            dashboardAcccess: true,
            userType: 'staff'
        });
        setEmail("");
        setMessage(null)
    };
    React.useEffect(() => {
        let dbRef = app.database().ref("users");
        dbRef.on("value", snap => setUsers((prevState) => ({ ...prevState, users: snap.val() })));
    }, [ ]);

   
    return (
        <div className={classes.root}>
           <Typography variant="h5">Admin Account</Typography>
           <br />
           <Typography variant="body1">Invite users</Typography>
           <TableContainer>
                <Table className={classes.table}>
                    <TableBody>
                        <TableRow>
                            <TableCell style={{ border: 'none', padding: 0 }}>
                                <TextField id="component-simple-email" 
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
                                {message && <label>{message}</label>}
                            </TableCell>
                            <TableCell align="right" style={{ border: 'none' }}>
                                <Button disabled={email.trim(" ").length > 0 ? false: true || disabled} onClick={() => handleSendInvitation()} color="primary" variant="contained">Send Invitation</Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
           </TableContainer>
           <br />
           <Typography variant="body1" color="primary">Team</Typography>
           <TableContainer component={Paper}>
                <Table aria-label="simple table" className={classes.table}>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#EEEEEE' }}>
                            <TableCell align="left" style={{ minWidth: '11vw' }}>
                                <Typography variant="body1">Email</Typography>
                            </TableCell>
                            <TableCell align="right" style={{ paddingRight: 0 }}>
                                <Typography variant="body1">Access</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body1">Promote</Typography>
                            </TableCell>
                            <TableCell align="right">
                                <Typography variant="body1">Delete</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                </Table>
           </TableContainer>
           <TableContainer className={classes.tableContainer}>
                <Table aria-label="simple table" className={classes.table}>
                    <TableBody className={classes.list}>
                        {users && users.users && Object.keys(users.users).map(item => {
                            return (
                                <TableRow className={classes.cell} key={item}>
                                    <TableCell>
                                        {users.users[item].email}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={users.users[item].dashboardAcccess}
                                            onChange={() => handleSwitchChange(item)}
                                            name={item}
                                            color="primary"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Select className={classes.select} variant="outlined" value={users.users[item].userType} onChange={(e) => handleUserType(e, item)} >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="staff">Staff</MenuItem>
                                        </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton style={{ color: '#FF0000' }} onClick={() => handleDelete(item)} color="error">
                                            <AiOutlineDelete  />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
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
        // height: '90vh',
        width: '100%',
        overflow: 'hidden',
        paddingTop: theme.spacing(4),
        paddingLeft: theme.spacing(8)
    },
    paper: {
        padding: theme.spacing(2)
    },
    table: {
        minWidth: 900
    },
    list: {
        maxHeight: '30vh',
        overflow: 'scroll',
        position: 'relative',
    },
    cell: {
        "&:hover": {
            backgroundColor: '#EEEEEE'
        }
    },
    tableContainer: {
        maxHeight: '60vh',
        position: 'relative',
    },
    select: {
        minWidth: '7vw'
    }
}));
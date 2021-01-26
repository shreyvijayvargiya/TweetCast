import React from 'react';
import { Paper, TextField, Typography, Grid, Table, TableCell, TableRow,InputAdornment, Input,  TableContainer, TableHead, TableBody, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';
import PhoneInput from 'react-phone-input-2';
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';

const Form = () => {
    
    const [ country, setCountry]= React.useState("");
    const [phone, setPhone] = React.useState("");
    const [city, setCity] = React.useState("");

    const [val, setVal] = React.useState({
        description: '',
        logo: '',
        date: '',
        companyName: '',
        clientCompanyName: '',
        country: 'United States',
        clientCountry: 'United States',
        address: '',
        clientAddress: '',
        city: '',
        clientCity: '',
        mobile: '',
        clientMobile: '',
        upiId: '',
        branchName: '',
        accountNumber: '',
        ifscCode: '',
        name: '',
        designation: '',
        region: '',
        tableData: []
    });

    const handleAddNewRow = () => {
        const newId = getId();
        const newData = {
            id: newId,
            quantity: 0,
            amount: 0,
            total: 0,
            description: ''
        };
        setVal(prevState => ({ ...prevState, tableData: [ ...val.tableData, newData ] }))
    };

    const handleDeleteRow = (id) => {
       const newArray = removeItem(val.tableData, id);
       setVal(prevState => ({ ...prevState, tableData: newArray }));
    };

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setVal(prevState => ({ ...prevState, [name]: value }));
    }

    const style = useStyles()
    
    const selectCountry = (val) => {
        setVal(prevState => ({ ...prevState, country: val }));
    };
   
    return (
        <form>
            <Paper className={style.paper} elevation={2}>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        <TextField 
                            name="logo"
                            variant="outlined"
                            size="small"
                            placeholder="Enter Description"
                            type="file"
                            value={val.logo}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Typography variant="h6">Invoice</Typography>
                        <TextField 
                            name="description"
                            variant="outlined"
                            size="small"
                            placeholder="Enter Description"
                            type="text"
                            value={val.description}
                            className={style.input}
                            onChange={handleChange}
                        />
                        <TextField 
                            name="date"
                            variant="outlined"
                            size="small"
                            placeholder="Selet date"
                            type="date"
                            value={val.date}
                            className={style.input}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
            </Paper>
            <br />
            <Paper className={style.paper} elevation={3}>
                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <Typography>Bill To</Typography>
                        <TextField 
                            name="companyName"
                            variant="outlined"
                            placeholder="Enter Company Name"
                            size="small"
                            value={val.companyName}
                            className={style.input}
                            onChange={handleChange}
                        />
                        <TextField 
                            name="address"
                            variant="outlined"
                            placeholder="Enter Address"
                            size="small"
                            value={val.address}
                            className={style.input}
                            onChange={handleChange}
                        />
                        <CountryDropdown
                            value={val.country}
                            className={style.input}
                            style={{ padding: '0.7em' }}
                            onChange={selectCountry}
                        />
                        <br />
                        <RegionDropdown
                            country={val.country}
                            value={city}
                            className={style.input}
                            style={{ padding: '0.7em' }}
                            onChange={(val) => setCity(val)} 
                        />
                        <br />
                        <PhoneInput
                            country={'us'}
                            value={phone}
                            containerClass={style.input}
                            containerStyle={{ width: '80%' }}
                            onChange={phone => setPhone(phone)}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Typography>Bill From</Typography>
                        <TextField 
                            name="clientCompanyName"
                            variant="outlined"
                            onChange={handleChange}
                            size="small"
                            value={val.clientCompanyName}
                            placeholder="Enter Client Company Name"
                            className={style.input}
                        />
                        <TextField 
                            name="clientAddress"
                            variant="outlined"
                            placeholder="Enter Address"
                            size="small"
                            value={val.clientAddress}
                            onChange={handleChange}
                            className={style.input}
                        />
                        <CountryDropdown
                            value={val.clientCountry}
                            style={{ padding: '0.7em' }}
                            className={style.input}
                            onChange={(val) =>  setVal(prevState => ({ ...prevState, clientCountry: val }))}
                        />
                        <br />
                        <RegionDropdown
                            country={val.clientCountry}
                            value={val.clientCity}
                            placeholder="Select City"
                            className={style.input}
                            style={{ padding: '0.7em' }}
                            onChange={(val) => setVal(prevState => ({ ...prevState, clientCity: val }))} 
                        />
                    </Grid>
                </Grid>
            </Paper>
            <Paper className={style.paper} elevation={3}>
                <TableContainer>
                    <Table>
                        <TableHead className={style.tableHead}>
                            <TableRow>
                                <TableCell style={{ width: '40%' }}>Description</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {val.tableData.length > 0 && val.tableData.map(item => {
                                return (
                                    <TableRow>
                                        <TableCell>
                                            <Input 
                                                name="quantity"
                                                style={{ width: '100%' }}
                                                value={item.description}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                name="quantity"
                                                value={item.quantity}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                name="quantity"
                                                value={item.price}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Input 
                                                startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                name="quantity"
                                                value={item.total}
                                            />
                                        </TableCell>
                                        {/* <TableCell>
                                            <IconButton onClick={() => handleDeleteRow(item.id)}>
                                                <AiOutlineDelete />
                                            </IconButton>
                                        </TableCell> */}
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>                 
                                <IconButton onClick={() => handleAddNewRow()}>
                                    <AiOutlinePlusCircle />
                                </IconButton>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper className={style.paper} elevation={3}>
                <Grid container spacing={4}>
                    <Grid item md={6}>
                        <Typography>Payment Details</Typography>
                        <TextField 
                            name="branchName"
                            variant="outlined"
                            placeholder="Enter Branch Name"
                            size="small"
                            value={val.branchName}
                            onChange={handleChange}
                            className={style.input}
                        />
                        <TextField 
                            name="accountNumber"
                            variant="outlined"
                            placeholder="Enter Account Number"
                            size="small"
                            value={val.accountNumber}
                            onChange={handleChange}
                            className={style.input}
                        />
                        <TextField 
                            name="ifscCode"
                            variant="outlined"
                            onChange={handleChange}
                            placeholder="Enter IFSC Code"
                            size="small"
                            value={val.ifscCode}
                            className={style.input}
                        />
                        <TextField 
                            name="upiId"
                            variant="outlined"
                            onChange={handleChange}
                            placeholder="Enter UPI ID"
                            size="small"
                            value={val.upiId}
                            className={style.input}
                        />
                    </Grid>
                    <Grid item md={6}>
                        <Typography>Signature Details</Typography>
                        <TextField 
                            name="logo"
                            variant="outlined"
                            size="small"
                            placeholder="Upload Signauture"
                            type="file"
                            className={style.input}
                        />
                        <TextField 
                            name="name"
                            variant="outlined"
                            size="small"
                            onChange={handleChange}
                            value={val.name}
                            placeholder="Enter Person Name"
                            className={style.input}
                        />
                        <TextField 
                            name="designation"
                            variant="outlined"
                            onChange={handleChange}
                            value={val.designation}
                            placeholder="Enter Person Designation"
                            size="small"
                            className={style.input}
                        />
                    </Grid>
                </Grid>
            </Paper>
        </form>
    )
};


export default Form;


const useStyles = makeStyles((theme) => ({
    input: {
        width: '72%',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(1)
    },
    paper :{
        width: '60%',
        margin: '1em auto',
        padding: theme.spacing(4)
    },
    tableHead: {
        backgroundColor: "#2D2D2D",
        "table > tr > th ": {
            color: "white"
        }
    }
}))


let id = 0;
function getId(){ 
    return id = id + 1;
};


function replaceItemAtIndex(arr, index, newValue) {
    return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
  }
  function removeItem(arr, index) {
    return [...arr.slice(0, index), ...arr.slice(index + 1)];
  }
  
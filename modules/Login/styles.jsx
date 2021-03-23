import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    box : {
      width: '20%',
      margin: 'auto',
      padding: theme.spacing(4),
      position: 'absolute',
      top: '20%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center',
      [theme.breakpoints.down('md')]: {
        width: '80vw',
        padding: 0,
        top: '15%'
      }
    },
    topbar:{
      backgroundColor: '#F9F9F9',
    },
    button: {
      width: '100%',
      margin: 'auto'
    },
    googleButton: {
      textTransform: 'none',
      color: 'black',
      padding: theme.spacing(1),
      border: '1px solid #2d2d2d',
      "&:hover": {
        backgroundColor: '#EEEEEE'
      }
  },
    title: {
     flexGrow: 1,
     color: "black"
    },
    input: {
      width: '100%',
      margin: 'auto',
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(2)
    },
    label : {
      width: '100%',
      margin: 'auto',
      textAlign: 'left'
    }
}));
import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    box : {
      width: '25%',
      margin: 'auto',
      padding: theme.spacing(4),
      position: 'absolute',
      top: '20%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center'
    }, 
    googleButton: {
      width: '100%',
      margin: 'auto',
      padding: theme.spacing(2)
    },
    topbar:{
      backgroundColor: '#F9F9F9',
    },
    button: {
      width: '100%',
      margin: 'auto'
    },
    title: {
     flexGrow: 1,
     color: "black"
    },
    input: {
      width: '100%',
      margin: 'auto',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    label : {
      width: '100%',
      margin: 'auto',
      textAlign: 'left'
    }
}));
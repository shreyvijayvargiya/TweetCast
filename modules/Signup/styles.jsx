import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
    },
    box : {
      width: '60%',
      margin: 'auto',
      padding: theme.spacing(4),
      position: 'absolute',
      top: '20%',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      textAlign: 'center'
    },
    topbar:{
      backgroundColor: '#F9F9F9',
    },
    button: {
      width: '30%',
      margin: 'auto'
    },
    title: {
     flexGrow: 1,
     color: "black"
    },
    input: {
      width: '30%',
      margin: 'auto',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2)
    },
    label : {
      width: '30%',
      margin: 'auto',
      textAlign: 'left'
    }
}));
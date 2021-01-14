import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    topbar:{
      backgroundColor: '#F9F9F9',
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      color: "black",
      textAlign: "left",
      "&:hover": {
        cursor: 'pointer'
      }
    },
}));
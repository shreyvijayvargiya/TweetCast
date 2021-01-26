import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    topbar:{
      backgroundColor: '#C19277',
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
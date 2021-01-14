import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    box: {
      width: '100%',
      margin: 'auto',
      padding: theme.spacing(4),
      position: 'absolute',
      top: '30%',
      textAlign: 'center'
    },
    button: {
      width: '20%',
      margin: 'auto'
    },
    root: {
      width: '100%',
      height: '90vh',
      position: 'relative',
    }
}));

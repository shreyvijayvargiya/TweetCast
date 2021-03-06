import React from 'react';
import { makeStyles } from '@material-ui/core/styles';


const Body = ({ children }) => {
    const styles = useStyles();
    return (
        <div className={styles.root}>
            {children}
        </div>
    );
};
export default Body;

export const useStyles = makeStyles((theme) => ({
    root: {
      padding: theme.spacing(0),
      margin: 'auto',
      position: 'absolute',
      zIndex: 0,
      width: '100%',
      height: 'fit-content'
    },
}));


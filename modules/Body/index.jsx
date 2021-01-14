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
      width: '100%',
      top: '8%',
      margin: 'auto',
      position: 'absolute',
    },
}));


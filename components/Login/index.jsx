import React from 'react';
import { Login } from '../../modules';
import { useStyles } from './styles';

const LoginComponent = () => {
    const styles = useStyles();
    return (
        <div className={styles.root}>
            <Login />
        </div>
    );
};
export default LoginComponent;

import React from 'react';
import { Signup } from '../../modules';
import { useStyles } from './styles';

const SignupComponent = () => {
    const styles = useStyles();
    return (
        <div className={styles.root}>
            <Signup />
        </div>
    );
};
export default SignupComponent;

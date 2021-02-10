import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { useStyles } from './styles';

const HomePage = () => {
	
 	const styles = useStyles();
	return (
		<div className={styles.root}>
			<div className={styles.box}>
				<Typography variant="h2">TweetCast</Typography>
				<Typography variant="h6">An application to manage your twitter account</Typography>
				<br />
				{/* <Button variant="outlined" size="large" className={styles.button} color="primary" >GET STARTED</Button> */}
			</div>
		</div>
	);
};
export default HomePage;




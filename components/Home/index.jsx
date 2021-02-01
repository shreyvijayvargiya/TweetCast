import React from 'react';
import { Button, Typography } from '@material-ui/core';
import { useStyles } from './styles';
import Box from '@material-ui/core/Box';
import axios from 'axios';

const HomePage = () => {
	const tokens = {
		consumer_key: process.env.consumerKey,
		sconsuler_secret: process.env.consumerSecret,
		acess_token: process.env.acessToken,
		token_scret: process.env.tokenSecret,
		bearer_token: process.env.bearerToken,
	};

 	const styles = useStyles();
	return (
		<div className={styles.root}>
			<div className={styles.box}>
				<Typography variant="h2">TweetCast</Typography>
				<Typography variant="h6">An application to manage your twitter account</Typography>
				<br />
				<Button variant="outlined" size="large" className={styles.button} color="primary">GET STARTED</Button>
			</div>
		</div>
	);
};
export default HomePage;

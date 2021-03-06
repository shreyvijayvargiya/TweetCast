import React from 'react';
import { Button, AppBar, Typography, Toolbar } from '@material-ui/core';
import { useStyles } from './styles';
import { useRouter } from 'next/router';
import { getCookie, removeCookie } from '../../utils/cookie';
import app from '../../utils/firebase';
import { removeUserFromStore } from '../../redux/action';

export default function Navbar() {
  const classes = useStyles();
  const router = useRouter();
  const [token, setToken] = React.useState(null);

  React.useEffect(() => {
    const uid = getCookie('uid');
    setToken(uid);
  });

 
 
  
  return (
      <AppBar position="fixed" className={classes.topbar}>
        <Toolbar>
          <Typography variant="h6" className={classes.title} onClick={() => router.push('/')}>
            TweetCast
          </Typography>
          {!token && <Button 
            variant={router.pathname === "/login" ? "contained": "text"} 
            className={classes.menuButton} 
            color="primary"
            size="small"
            onClick={() => router.push('/login')}
            >
              login
          </Button>}
          {token && <Button 
            variant={router.pathname === '/dashboard' ? "contained": "text"} 
            className={classes.menuButton} 
            color="primary"
            size="small"
            onClick={() => router.push({ pathname: '/dashboard', query: { type: 'tweets' } })}
          >
            Dashboard
          </Button>}
        </Toolbar>
      </AppBar>
  );
}

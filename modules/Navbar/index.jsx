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

  const handleLogout = () => {
    removeCookie('uid');
    removeUserFromStore()
    app.auth().signOut();
    router.push('/login')
  };
 
  
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
            onClick={() => router.push('/login')}
            >
              login
          </Button>}
          {!token &&
            <Button 
              variant={router.pathname === '/signup' ? "contained": "text"} 
              className={classes.menuButton} 
              color="primary"
              onClick={() => router.push('/signup')}
            >
              Signup
            </Button>
          }
          {token && <Button 
            variant={router.pathname === '/dashboard' ? "contained": "text"} 
            className={classes.menuButton} 
            color="primary"
            onClick={() => router.push({ pathname: '/dashboard', query: { type: 'admin' } })}
          >
            Dashboard
          </Button>}
          {token && <Button 
            variant="text"
            className={classes.menuButton} 
            color="primary"
            onClick={() => handleLogout()}
          >
            Logout
          </Button>}
        </Toolbar>
      </AppBar>
  );
}

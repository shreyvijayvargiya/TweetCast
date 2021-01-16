import React from 'react';
import Head from 'next/head';
import { theme } from '../utils/theme';
import { Provider } from 'react-redux'
import { store } from '../redux/store';
import { ThemeProvider } from '@material-ui/core/styles';
import { Navbar, Body } from '../modules/index';
import CssBaseline from '@material-ui/core/CssBaseline';
import { applyMiddleware, createStore  } from 'redux';
import { userReducer } from '../redux/reducer';
import thunk from "redux-thunk"

function MyApp({ Component, pageProps }) {
    React.useEffect(() => {

        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
          jssStyles.parentElement.removeChild(jssStyles);
        }
      }, []);
    
    const store = createStore(userReducer, applyMiddleware(thunk));

    return (
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <Head>
                <title>TweetCast</title>
            </Head>
            <Navbar />
            <Body>
              <Component {...pageProps} />
            </Body>
          </ThemeProvider>
        </Provider>
    );
  };
  
export default MyApp;

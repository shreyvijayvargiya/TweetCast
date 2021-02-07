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
import 'react-phone-input-2/lib/style.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react'
import { useRouter } from 'next/router';


function MyApp({ Component, pageProps }) {

  const router = useRouter();

    React.useEffect(() => {

        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
          jssStyles.parentElement.removeChild(jssStyles);
        }
      }, []);
      const persistConfig = {
        key: 'root',
        storage,
      }
    const persistedReducer = persistReducer(persistConfig, userReducer)
    const store = createStore(persistedReducer, applyMiddleware(thunk));
    const persistor = persistStore(store);

    return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              <Head>
                  <title>TweetCast</title>
              </Head>
              {router.pathname !== "/dashboard" && <Navbar />}
              <Body>
                <Component {...pageProps} />
              </Body>
            </ThemeProvider>
          </PersistGate>
        </Provider>
    );
  };
  
export default MyApp;

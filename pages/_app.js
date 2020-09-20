import React from 'react';
import Head from 'next/head';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from '../src/helpers/UserContext';
import { ToastContainer } from 'react-toastify';

export default function App({ Component, pageProps }) {
    return (
        <UserProvider>
            <Head>
                <title>Caboot</title>
            </Head>
            <Component {...pageProps} />
            <ToastContainer
                position="bottom-center"
                autoClose={1500}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                pauseOnHover
            />
        </UserProvider>
    );
}

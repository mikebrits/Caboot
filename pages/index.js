import Head from 'next/head';
import { Page } from '../src/components/Page';
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { BsPlay } from 'react-icons/bs';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRouter } from 'next/router';
import { getGameByPin } from '../src/api/activeQuiz.api';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 400,
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    },
    divider: {
        height: 28,
        margin: 4,
    },
}));

export default function Home() {
    const classes = useStyles();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const handleSubmit = async () => {
        try {
            setError('');
            await getGameByPin(pin);
            router.push(`/play/name?pin=${pin}`);
        } catch (e) {
            setError(e);
        }
    };
    return (
        <Page>
            <div>
                <Head>
                    <title>Caboot</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <h1>Welcome to Caboot</h1>
                <Paper
                    component="form"
                    className={classes.root}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <InputBase
                        className={classes.input}
                        placeholder="Enter Game Pin"
                        inputProps={{ 'aria-label': 'Enter Game Pin' }}
                        error={error}
                        onChange={(e) => {
                            setPin(e.currentTarget.value);
                        }}
                        value={pin}
                    />
                    {error && <p>{error.toString()}</p>}
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <BsPlay />
                    </IconButton>
                </Paper>
            </div>
        </Page>
    );
}

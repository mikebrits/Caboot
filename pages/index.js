import Head from 'next/head';
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { BsPlay } from 'react-icons/bs';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRouter } from 'next/router';
import { getGameByPin } from '../src/api/game.api';

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
    const favicon = '/favicon.ico';
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
        <>
            <div>
                <Head>
                    <title>Caboot</title>
                    <link rel="icon" href={favicon} />
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

                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <BsPlay />
                    </IconButton>
                </Paper>
                {error && <p>{error.toString()}</p>}
            </div>
        </>
    );
}

import Head from 'next/head';
import { Page } from '../src/components/Page';
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import { BsPlay } from 'react-icons/bs';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import { joinGame } from '../src/api/activeQuiz.api';
import { toast } from 'react-toastify';
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');

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

const getName = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        style: 'capital',
        separator: '',
    });
};

export default function Home() {
    const classes = useStyles();
    const [pin, setPin] = useState('');
    const router = useRouter();
    const [name, setName] = useState(getName());
    const handleSubmit = async () => {
        try {
            await joinGame(pin, name);
            toast.success('Joined Game!');
            await router.push(`/play/${pin.trim()}`);
        } catch (e) {
            toast.error(`Could not join game: ${e}`);
            console.error(e);
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
                        onChange={(e) => {
                            setPin(e.currentTarget.value);
                        }}
                        value={pin}
                    />
                    <IconButton type="submit" className={classes.iconButton} aria-label="search">
                        <BsPlay />
                    </IconButton>
                </Paper>
                <br />
                <Paper className={classes.root}>
                    <p>{name}</p> <br />
                    <Button onClick={() => setName(getName())}>Get New Name</Button>
                </Paper>
            </div>
        </Page>
    );
}

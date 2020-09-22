import React from 'react';
import { Page } from '../../src/components/Page';
import { useActiveQuizByPin } from '../../src/api/activeQuiz.api';
import Spinner from '../../src/components/Spinner';

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useActiveQuizByPin(pin);

    if (loading) {
        return <Spinner />;
    }
    if (!game) {
        return (
            <Page>
                <h1>Quiz Not Found</h1>
            </Page>
        );
    }
    if (error) {
        return (
            <Page>
                <h1>There was an error loading your game</h1>
            </Page>
        );
    }
    console.log({ player, game });

    return (
        <Page>
            <h1>{game.title}</h1>
            <p>Your name is {player.name}</p>
            <p>Game status: {game.status}</p>
        </Page>
    );
};

export async function getServerSideProps(context) {
    return {
        props: {
            pin: context.params.pin,
        },
    };
}

export default Play;

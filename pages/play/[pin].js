import React from 'react';
import { Page } from '../../src/components/Page';
import { useActiveQuizByPin } from '../../src/api/activeQuiz.api';
import Spinner from '../../src/components/Spinner';
import { getPlayerForLocalGame } from '../../src/api/localGameState';
import { useRouter } from 'next/router';

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useActiveQuizByPin(pin);
    const router = useRouter();
    if (error) {
        return (
            <Page>
                <h1>There was an error loading your game</h1>
            </Page>
        );
    }
    if (loading) {
        return <Spinner />;
    }

    if (!getPlayerForLocalGame(game.id)) {
        router.push(`/play/name?${pin}`);
    }

    if (!game) {
        return (
            <Page>
                <h1>Quiz Not Found</h1>
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

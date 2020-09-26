import Error from '../Error';
import React from 'react';
import { gameStatuses, useGameByPin } from '../../../api/game.api';
import Spinner from '../../Spinner';
import { getPlayerForLocalGame } from '../../../api/localGameState';
import { useRouter } from 'next/router';
import Ended from './Ended';
import WaitingToStart from './WaitingToStart';
import AnsweringQuestion from './AnsweringQuestion';

const stateMap = {
    [gameStatuses.ended]: Ended,
    [gameStatuses.waiting]: WaitingToStart,
    [gameStatuses.inProgress]: AnsweringQuestion,
    default: AnsweringQuestion,
};

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useGameByPin(pin);
    const router = useRouter();

    if (error) {
        return <Error title={'There was an error loading your game'} text={error.toString()} />;
    }

    if (loading) {
        return <Spinner />;
    }

    if (!getPlayerForLocalGame(game.id)) {
        router.push(`/play/name?${pin}`);
    }

    const GameState = stateMap[game.status] || stateMap.default;

    return <GameState game={game} player={player} />;
};

export default Play;

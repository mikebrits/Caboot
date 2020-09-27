import Error from '../Error';
import React from 'react';
import { gameStatuses, useGameByPin } from '../../../api/game.api';
import Spinner from '../../Spinner';
import { getPlayerForLocalGame } from '../../../helpers/localGameState';
import { useRouter } from 'next/router';
import Ended from './Ended';
import LobbyOpen from './LobbyOpen';
import AnsweringQuestion from './AnsweringQuestion';
import LobbyClosed from './LobbyClosed';

const stateMap = {
    [gameStatuses.ended]: Ended,
    [gameStatuses.lobbyOpen]: LobbyOpen,
    [gameStatuses.lobbyClosed]: LobbyClosed,
    [gameStatuses.answeringQuestion]: AnsweringQuestion,
    [gameStatuses.allAnswered]: AnsweringQuestion,
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

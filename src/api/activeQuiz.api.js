import { db } from '../config/firebase';
import { useUser } from '../helpers/UserContext';
import { transformDoc, useRealtimeDoc } from './query';
import { addPlayerToGame, playerRef } from './players.api';
import { getPlayerForLocalGame, setLocalGame } from './localGameState';
import { useEffect, useState } from 'react';

export const activeQuizCollectionRef = () => db.collection('active-quizzes');
export const activeQuizRef = (id) => activeQuizCollectionRef().doc(id);
export const activeQuizByPin = (pin) => activeQuizCollectionRef().where('pin', '==', pin);

export const activeQuizStatuses = {
    inProgress: 'IN_PROGRESS',
    ended: 'ENDED',
    waiting: 'WAITING',
};

const defaultActiveQuiz = () => ({
    status: activeQuizStatuses.waiting,
    pin: Math.floor(Math.random() * 100000).toString(),
});

export const createActiveQuiz = async (details = {}) => {
    const quiz = { ...defaultActiveQuiz(), ...details };
    const doc = await activeQuizCollectionRef().add(quiz);
    return {
        id: doc.id,
        ...quiz,
    };
};

export const useActiveQuiz = (id) => {
    return useRealtimeDoc(activeQuizRef(id));
};

export const useCreateActiveQuiz = () => {
    const { user } = useUser();
    return async (details) => createActiveQuiz({ owner: user.uid, ...details });
};

export const updateActiveQuiz = async (id, data) => {
    await activeQuizRef(id).update(data);
};

export const startActiveQuiz = async (id) => {
    await updateActiveQuiz(id, { status: activeQuizStatuses.inProgress });
};

export const endActiveQuiz = async (id) => {
    await updateActiveQuiz(id, { status: activeQuizStatuses.ended });
};

export const useActiveQuizByPin = (pin) => {
    const [error, setError] = useState('');
    const [game, setGame] = useState(null);
    const [player, setPlayer] = useState(null);

    const [playerLoading, setPlayerLoading] = useState(true);
    const [gameLoading, setGameLoading] = useState(true);

    const getPlayerAndGameSnapshots = async (playerId, gameId) => {
        playerRef(gameId, playerId).onSnapshot(
            (data) => {
                setPlayer(transformDoc(data));
                setPlayerLoading(false);
            },
            (error) => {
                setError(error);
                setPlayerLoading(false);
            },
        );
        activeQuizRef(gameId).onSnapshot(
            (data) => {
                setGame(transformDoc(data));
                setGameLoading(false);
            },
            (error) => {
                setError(error);
                setGameLoading(false);
            },
        );
    };

    useEffect(() => {
        getGameByPin(pin)
            .then((game) => {
                const player = getPlayerForLocalGame(game.id);
                getPlayerAndGameSnapshots(player.id, game.id);
            })
            .catch((e) => setError(e));
    }, []);

    return [{ player, game }, playerLoading || gameLoading, error];
};

export const getGameByPin = async (pin) => {
    const games = await activeQuizByPin(pin).get();
    const game = games.docs[0];
    if (!game || !game.exists) {
        throw new Error('Game not found');
    }
    return { id: game.id, ...game.data() };
};

export const joinGame = async (pin, name) => {
    const game = await getGameByPin(pin);
    if (!game) {
        throw new Error(`Game not found with pin ${pin}`);
    }
    if (getPlayerForLocalGame(game.id)) {
        throw new Error(`You have already joined this game`);
    }
    const player = await addPlayerToGame(game.id, name);
    setLocalGame(game.id, player);
    return player;
};

//import {db} from "../config/firebase";
import { gameRef } from './game.api';
import { useRealtimeCollection } from './query';
import { useEffect, useState } from 'react';

export const playersCollectionRef = (gameId) => gameRef(gameId).collection('players');
export const playerRef = (gameId, playerId) => playersCollectionRef(gameId).doc(playerId);
export const playerByNameRef = (gameId, name) =>
    playersCollectionRef(gameId).where('name', '==', name);

export const getNewPlayer = (name) => ({
    name,
    score: 0,
    streak: 0,
    answers: [],
});

export const addPlayerToGame = async (gameId, name) => {
    const exists = (await playerByNameRef(gameId, name).get()).docs[0];
    if (exists) {
        throw new Error('Name already exists');
    }
    const player = getNewPlayer(name);
    const playerSnap = await playersCollectionRef(gameId).add(player);
    return { id: playerSnap.id, ...player };
};

export const usePlayers = (gameId) => {
    return useRealtimeCollection(playersCollectionRef(gameId));
};

export const kickPlayer = async (gameId, playerId) => {
    return await playerRef(gameId, playerId).delete();
};

export const usePlayerCurrentAnswer = (game, player) => {
    const [answer, setAnswer] = useState('');

    useEffect(() => {
        if (player?.answers) {
            setAnswer(player.answers.find((i) => i.questionId === game.currentQuestionId));
        }
    }, [player?.answers]);

    return [answer, setAnswer];
};

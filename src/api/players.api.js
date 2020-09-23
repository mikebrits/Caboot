//import {db} from "../config/firebase";
import { activeQuizRef } from './activeQuiz.api';
import { useRealtimeCollection } from './query';

export const playersCollectionRef = (gameId) => activeQuizRef(gameId).collection('players');
export const playerRef = (gameId, playerId) => playersCollectionRef(gameId).doc(playerId);
export const playerByNameRef = (gameId, name) =>
    playersCollectionRef(gameId).where('name', '==', name);

export const addPlayerToGame = async (gameId, name) => {
    const exists = (await playerByNameRef(gameId, name).get()).docs[0];
    if (exists) {
        throw new Error('Name already exists');
    }
    const player = await playersCollectionRef(gameId).add({
        name,
        score: 0,
        streak: 0,
        answers: [],
    });
    return { id: player.id, name };
};

export const usePlayers = (gameId) => {
    return useRealtimeCollection(playersCollectionRef(gameId));
};

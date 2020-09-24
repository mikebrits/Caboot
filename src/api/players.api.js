//import {db} from "../config/firebase";
import { activeQuizRef } from './activeQuiz.api';
import { useRealtimeCollection } from './query';

export const playersCollectionRef = (gameId) => activeQuizRef(gameId).collection('players');
export const playerRef = (gameId, playerId) => playersCollectionRef(gameId).doc(playerId);
export const playerByNameRef = (gameId, name) =>
    playersCollectionRef(gameId).where('name', '==', name);

const getNewPlayer = (name) => ({
    name,
    score: 0,
    streak: 0,
    answers: [],
})

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

import { db } from '../config/firebase';
import { useUser } from '../helpers/UserContext';
import { batchUpdate, transformDoc, useRealtimeDoc } from './query';
import { addPlayerToGame, getNewPlayer, playerRef, playersCollectionRef } from './players.api';
import { getPlayerForLocalGame, setLocalGame } from './localGameState';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import * as firebase from 'firebase';

export const gameCollectionRef = () => db.collection('active-quizzes');
export const gameRef = (id) => gameCollectionRef().doc(id);
export const gameByPin = (pin) => gameCollectionRef().where('pin', '==', pin);

export const gameStatuses = {
    inProgress: 'IN_PROGRESS',
    ended: 'ENDED',
    waiting: 'WAITING',
    preQuestion: 'PRE_QUESTION',
    inQuestion: 'QUESTION',
};

export const QUESTION_DURATION = 20000;

export const getNewGame = (title, pin) => ({
    status: gameStatuses.waiting,
    questionIndex: 0,
    currentQuestion: '',
    questionDuration: QUESTION_DURATION,
    answers: [],
    pin,
    title,
});

export const createGame = async (details = {}) => {
    const quiz = {
        ...getNewGame('', Math.floor(Math.random() * 100000).toString()),
        ...details,
    };
    const doc = await gameCollectionRef().add(quiz);
    return {
        id: doc.id,
        ...quiz,
    };
};

export const useGame = (id) => {
    return useRealtimeDoc(gameRef(id));
};

export const useCreateGame = () => {
    const { user } = useUser();
    return async (details) => createGame({ owner: user.uid, ...details });
};

export const updateGame = async (id, data) => {
    await gameRef(id).update(data);
};

export const startGame = async (id) => {
    await updateGame(id, { status: gameStatuses.inProgress, questionIndex: 0 });
};

export const endGame = async (id) => {
    await updateGame(id, { status: gameStatuses.ended });
};

export const useGameByPin = (pin) => {
    const [error, setError] = useState('');
    const [game, setGame] = useState({});
    const [player, setPlayer] = useState({});

    const [playerLoading, setPlayerLoading] = useState(true);
    const [gameLoading, setGameLoading] = useState(true);
    const router = useRouter();

    const getPlayerAndGameSnapshots = (playerId, gameId) => {
        playerRef(gameId, playerId).onSnapshot(
            (data) => {
                if (!data.exists) {
                    setError('Player does not exist');
                    return;
                }
                setPlayer(transformDoc(data));
                setPlayerLoading(false);
            },
            (error) => {
                setError(error);
                setPlayerLoading(false);
            },
        );
        gameRef(gameId).onSnapshot(
            (data) => {
                if (!data.exists) {
                    setError('Game does not exist');
                    return;
                }
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
                if (!player) {
                    router.push(`/play/name?pin=${pin}`);
                } else {
                    getPlayerAndGameSnapshots(player.id, game.id);
                }
            })
            .catch((e) => setError(e));
    }, []);

    return [{ player, game }, playerLoading || gameLoading, error];
};

export const getGameByPin = async (pin) => {
    const games = await gameByPin(pin).get();
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
    if (game.status !== gameStatuses.waiting) {
        throw new Error('This game is not currently accepting new players');
    }
    const player = await addPlayerToGame(game.id, name);
    setLocalGame(game.id, player);
    return player;
};

export const setCurrentQuestion = async (id, currentQuestionId, currentQuestion, answers) => {
    await gameRef(id).update({
        currentQuestionId,
        currentQuestion,
        answers,
        showAnswers: false,
        currentQuestionStartedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
};

export const resetCurrentQuiz = async (id, game) => {
    await gameRef(id).set(getNewGame(game.title, game.pin));
    const { name, ...blankPlayer } = getNewPlayer('');
    await batchUpdate(playersCollectionRef(id), blankPlayer);
};

export const answerQuestion = async (
    gameId,
    playerId,
    questionId,
    answerId,
    timeStarted,
    playerScore,
) => {
    const answerCorrect = answerId === '0';
    const timeFinished = new Date().getTime();
    const possibleScore = 5000 - (timeFinished - timeStarted);
    const adjustedScore = possibleScore > 1000 ? possibleScore : 1000;
    const score = answerCorrect ? adjustedScore : 0;

    const ref = playerRef(gameId, playerId);
    await ref.update({
        score: playerScore + score,
        answers: firebase.firestore.FieldValue.arrayUnion({
            questionId,
            answerId,
            score,
        }),
    });
    return score;
};

export const moveToNextQuestion = async (gameId, currentIndex, players) => {
    const leaderboard = players
        .map(({ name, score }) => ({ name, score }))
        .sort((a, b) => b.score - a.score);
    await gameRef(gameId).update({
        questionIndex: currentIndex + 1,
        showAnswers: true,
        leaderboard,
    });
};

import React, { useEffect, useState } from 'react';
import { requiresAuth } from '../../../helpers/withAuth';
import {
    gameStatuses,
    moveToNextQuestion,
    resetCurrentQuiz,
    setCurrentQuestion,
    startGame,
} from '../../../api/game.api';
import Spinner from '../../Spinner';
import { useManageQuiz, useStopQuiz } from '../../../api/quizzes.api';
import Button from '@material-ui/core/Button';
import Error from '../Error';

const Manage = ({ quizId, gameId }) => {
    const [{ players, game, quiz, questions }, loading, error] = useManageQuiz(quizId, gameId);
    const [canAsk, setCanAsk] = useState(false);
    const stopQuiz = useStopQuiz();

    useEffect(() => {
        // if game started and all players answered
        // set game state to all players answered
    }, [players]);

    const orderedQuestions = () =>
        quiz.questionOrder.map((id) => questions.find((i) => i.id === id));
    const nextQuestion = () => orderedQuestions()[game.questionIndex];

    const handleStart = async () => {
        await startGame(gameId);
        setCanAsk(true);
    };

    const startTimer = () => {
        setTimeout(() => {}, 5000);
    };

    const handleNextQuestion = async () => {
        setCanAsk(true);
        await moveToNextQuestion(game.id, game.questionIndex, players);
    };

    const askQuestion = async () => {
        setCanAsk(false);
        const question = nextQuestion();
        await setCurrentQuestion(gameId, question.id, question.text, question.answers);
        startTimer();
    };

    const playerHasAnsweredQuestion = (playerId, questionId) => {
        const player = players.find((i) => i.id === playerId);
        return !!player.answers.find((i) => i.questionId === questionId);
    };

    const playerHasAnsweredCurrentQuestion = (playerId) => {
        return !!playerHasAnsweredQuestion(playerId, game.currentQuestionId);
    };

    const allPlayersAnswered = () => {
        return players.every((p) => p.answers.find((i) => i.questionId === game.currentQuestionId));
    };

    const handleEndGame = async () => {
        await stopQuiz(quiz);
    };

    if (loading) return <Spinner />;

    if (error) return <Error title={'Error'} text={error} />;
    if (quiz.game !== gameId) return <Error title={'Quizzes dont match'} />;

    return (
        <>
            <h1>Manage Game: {quiz.title}</h1>
            <Button
                color="primary"
                variant="contained"
                onClick={() => resetCurrentQuiz(gameId, game)}
            >
                Reset Game
            </Button>
            <p>Current State: {game.status}</p>
            {game.status === gameStatuses.waiting && (
                <Button color="primary" variant="contained" onClick={handleStart}>
                    Start Game
                </Button>
            )}

            <p>Total Questions: {questions.length}</p>
            <p>Game link: https://caboot-zeta.vercel.app/play/{game.pin}</p>
            {game.status === gameStatuses.inProgress && nextQuestion() && (
                <>
                    <h3>Next Question:</h3>
                    {nextQuestion().text}
                    {!canAsk && allPlayersAnswered() && (
                        <Button color="primary" variant="contained" onClick={handleNextQuestion}>
                            Show Leaderboard
                        </Button>
                    )}
                    {canAsk && (
                        <Button color="primary" variant="contained" onClick={askQuestion}>
                            Start Question
                        </Button>
                    )}
                </>
            )}
            {!nextQuestion() && (
                <>
                    <h2>Game over</h2>
                    <Button color="primary" variant="contained" onClick={handleEndGame}>
                        End Game
                    </Button>
                </>
            )}

            <div>
                <h3>Players</h3>
                {!players && <p>No players in yet</p>}
                <ul>
                    {players &&
                        players
                            .sort((a, b) => b.score - a.score)
                            .map((player) => (
                                <li
                                    key={player.id}
                                    style={{
                                        color: playerHasAnsweredCurrentQuestion(player.id)
                                            ? 'green'
                                            : 'red',
                                    }}
                                >
                                    {player.name} - {player.score}
                                </li>
                            ))}
                </ul>
            </div>
        </>
    );
};

export default requiresAuth(Manage);

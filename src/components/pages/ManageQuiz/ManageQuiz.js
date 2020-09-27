import React, { useEffect } from 'react';
import { requiresAuth } from '../../../helpers/withAuth';
import {
    gameStatuses,
    moveToNextQuestion,
    resetCurrentQuiz,
    setCurrentQuestion,
    setGameStatus,
    showLeaderboard,
    startGame,
} from '../../../api/game.api';
import Spinner from '../../Spinner';
import { useManageQuiz, useStopQuiz } from '../../../api/quizzes.api';
import Button from '@material-ui/core/Button';
import Error from '../Error';
import PlayerManager from './PlayerManager';

const Manage = ({ quizId, gameId }) => {
    const [{ players, game, quiz, questions }, loading, error] = useManageQuiz(quizId, gameId);
    const stopQuiz = useStopQuiz();

    useEffect(() => {
        if (!loading && game.status === gameStatuses.answeringQuestion && allPlayersAnswered()) {
            setGameStatus(gameId, gameStatuses.allAnswered);
        }
    }, [players]);

    const orderedQuestions = () =>
        quiz.questionOrder.map((id) => questions.find((i) => i.id === id));
    const nextQuestion = () => orderedQuestions()[game.questionIndex];

    const handleStart = async () => {
        await startGame(gameId);
    };

    const handleShowAnswer = async () => {
        await setGameStatus(gameId, gameStatuses.showAnswer);
    };

    const handleShowLeaderBoard = async () => {
        await showLeaderboard(gameId, players);
    };

    const handleNextQuestion = async () => {
        await moveToNextQuestion(game.id, game.questionIndex, players);
    };

    const askQuestion = async () => {
        if (game.status === gameStatuses.lobbyClosed) {
            await setGameStatus(game.id, gameStatuses.answeringQuestion);
        }
        const question = nextQuestion();
        await setCurrentQuestion(gameId, question.id, question.text, question.answers);
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
            {game.status === gameStatuses.lobbyOpen && (
                <Button color="primary" variant="contained" onClick={handleStart}>
                    Close Lobby
                </Button>
            )}

            <p>Total Questions: {questions.length}</p>
            <p>Game link: https://caboot-zeta.vercel.app/play/{game.pin}</p>
            {nextQuestion() && (
                <>
                    <h3>Next Question:</h3>
                    {nextQuestion().text}

                    {game.status === gameStatuses.allAnswered && (
                        <Button color="primary" variant="contained" onClick={handleShowAnswer}>
                            Show Answer
                        </Button>
                    )}

                    {game.status === gameStatuses.showAnswer && (
                        <Button color="primary" variant="contained" onClick={handleShowLeaderBoard}>
                            Show Leaderboard
                        </Button>
                    )}

                    {game.status === gameStatuses.showLeaderboard && (
                        <Button color="primary" variant="contained" onClick={handleNextQuestion}>
                            Next Question
                        </Button>
                    )}

                    {game.status === gameStatuses.showLeaderboard ||
                        (game.status === gameStatuses.lobbyClosed && (
                            <Button color="primary" variant="contained" onClick={askQuestion}>
                                Start Question
                            </Button>
                        ))}
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
                <PlayerManager game={game} players={players} />
            </div>
        </>
    );
};

export default requiresAuth(Manage);

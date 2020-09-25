import React, { useState } from 'react';
import { Page } from '../../../../src/components/Page';
import { requiresAuth } from '../../../../src/helpers/withAuth';
import {
    activeQuizStatuses,
    moveToNextQuestion,
    resetCurrentQuiz,
    setCurrentQuestion,
    startActiveQuiz,
    useActiveQuiz,
} from '../../../../src/api/activeQuiz.api';
import Spinner from '../../../../src/components/Spinner';
import { useQuestions, useQuiz, useStopQuiz } from '../../../../src/api/quizzes.api';
import { usePlayers } from '../../../../src/api/players.api';
import Button from '@material-ui/core/Button';
import { QUESTION_DURATION } from '../../../../src/components/pages/Play/Play';

const Manage = ({ id, activeQuizId }) => {
    const [game, loading] = useActiveQuiz(activeQuizId);
    const [quiz, quizLoading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);
    const [players] = usePlayers(activeQuizId);
    const [canAsk, setCanAsk] = useState(true);
    const [getNext, setGetNext] = useState(true);
    const stopQuiz = useStopQuiz();

    const orderedQuestions = () =>
        quiz.questionOrder.map((id) => questions.find((i) => i.id === id));
    const nextQuestion = () => orderedQuestions()[game.questionIndex];

    const handleStart = async () => {
        await startActiveQuiz(activeQuizId);
        setCanAsk(true);
        setGetNext(false);
    };

    const startTimer = () => {
        setTimeout(() => {
            setGetNext(true);
        }, QUESTION_DURATION);
    };

    const handleNextQuestion = async () => {
        setGetNext(false);
        setCanAsk(true);
        await moveToNextQuestion(game.id, game.questionIndex, players);
    };

    const askQuestion = async () => {
        setCanAsk(false);
        setGetNext(false);
        const question = nextQuestion();
        await setCurrentQuestion(activeQuizId, question.id, question.text, question.answers);
        startTimer();
    };

    const handleEndGame = async () => {
        await stopQuiz(quiz);
    };

    if (loading || quizLoading || questionsLoading) return <Spinner />;

    if (!game || !quiz)
        return (
            <Page>
                <h1>No Quiz found</h1>
            </Page>
        );
    if (quiz.activeQuiz !== activeQuizId)
        return (
            <Page>
                <h1>Quizzes Dont Match</h1>
            </Page>
        );
    return (
        <Page>
            <h1>Manage Game: {quiz.title}</h1>
            <Button
                color="primary"
                variant="contained"
                onClick={() => resetCurrentQuiz(activeQuizId, game)}
            >
                Reset Game
            </Button>
            <p>Current State: {game.status}</p>
            {game.status === activeQuizStatuses.waiting && (
                <Button color="primary" variant="contained" onClick={handleStart}>
                    Start Game
                </Button>
            )}

            <p>Total Questions: {questions.length}</p>
            <p>Game link: play/{game.pin}</p>
            {game.status === activeQuizStatuses.inProgress && nextQuestion() && (
                <>
                    <h3>Next Question:</h3>
                    {nextQuestion().text}
                    {getNext && (
                        <Button color="primary" variant="contained" onClick={handleNextQuestion}>
                            Next Question / Show Leaderboard
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
                                <li key={player.id}>
                                    {player.name} - {player.score}
                                </li>
                            ))}
                </ul>
            </div>
        </Page>
    );
};

export async function getServerSideProps(context) {
    return {
        props: {
            id: context.params.id,
            activeQuizId: context.params.activeQuizId,
        },
    };
}

export default requiresAuth(Manage);

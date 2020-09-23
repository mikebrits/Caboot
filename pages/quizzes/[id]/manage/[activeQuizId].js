import React from 'react';
import { Page } from '../../../../src/components/Page';
import { requiresAuth } from '../../../../src/helpers/withAuth';
import {
    activeQuizStatuses,
    startActiveQuiz,
    useActiveQuiz,
} from '../../../../src/api/activeQuiz.api';
import Spinner from '../../../../src/components/Spinner';
import { useQuestions, useQuiz } from '../../../../src/api/quizzes.api';
import { usePlayers } from '../../../../src/api/players.api';
import Button from '@material-ui/core/Button';

const Manage = ({ id, activeQuizId }) => {
    const [game, loading] = useActiveQuiz(activeQuizId);
    const [quiz, quizLoading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);
    const [players] = usePlayers(activeQuizId);

    const handleStart = async () => {
        await startActiveQuiz(activeQuizId);
    };

    if (loading || quizLoading || questionsLoading) return <Spinner />;

    //TODO: Use memo
    const orderedQuestions = quiz.questionOrder.map((id) => questions.find((i) => i.id === id));

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
            <p>Current State: {game.status}</p>
            {game.status === activeQuizStatuses.waiting && (
                <Button color="primary" variant="contained" onClick={handleStart}>
                    Start Game
                </Button>
            )}

            <p>Total Questions: {questions.length}</p>
            <p>Game link: play/{game.pin}</p>
            {game.status === activeQuizStatuses.inProgress && (
                <>
                    <h3>Next Question:</h3>
                    {orderedQuestions[game.questionIndex].text}
                </>
            )}

            <div>
                <h3>Players</h3>
                {!players && <p>No players in yet</p>}
                <ul>
                    {players && players.map((player) => <li key={player.id}>{player.name}</li>)}
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

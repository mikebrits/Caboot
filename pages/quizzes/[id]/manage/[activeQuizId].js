import React from 'react';
import { Page } from '../../../../src/components/Page';
import { requiresAuth } from '../../../../src/helpers/withAuth';
import { useActiveQuiz } from '../../../../src/api/activeQuiz.api';
import Spinner from '../../../../src/components/Spinner';
import { useQuestions, useQuiz } from '../../../../src/api/quizzes.api';

const Manage = ({ id, activeQuizId }) => {
    const [activeQuiz, loading] = useActiveQuiz(activeQuizId);
    const [quiz, quizLoading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);

    if ((loading, quizLoading, questionsLoading)) return <Spinner />;

    if (!activeQuiz || !quiz)
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
            <h1>Manage Game</h1>
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

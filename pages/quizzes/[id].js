import React from 'react';
import { requiresAuth } from '../../src/helpers/withAuth';
import { Page } from '../../src/components/Page';
import { useQuestions, useQuiz } from '../../src/api/quizzes/quizzes.api';
import Spinner from '../../src/components/Spinner';
import EditQuestion from '../../src/components/EditQuestion';

function Quizzes({ id }) {
    const [quiz, loading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);
    if (loading) return <Spinner />;
    return (
        <Page>
            <h1>Quiz: {quiz.title}</h1>
            {questionsLoading ? (
                <Spinner />
            ) : (
                questions.map((item, index) => <EditQuestion question={item} key={index} />)
            )}
        </Page>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            id: context.params.id,
        },
    };
}

export default requiresAuth(Quizzes);

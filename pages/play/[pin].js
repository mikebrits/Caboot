import React from 'react';
import { Page } from '../../src/components/Page';
import { useActiveQuizByPin } from '../../src/api/activeQuiz.api';
import Spinner from '../../src/components/Spinner';

const Play = ({ pin }) => {
    const [quizArray, loading] = useActiveQuizByPin(pin);

    if (loading) {
        return <Spinner />;
    }
    const quiz = quizArray[0];
    if (!quiz) {
        return (
            <Page>
                <h1>Quiz Not Found</h1>
            </Page>
        );
    }

    return (
        <Page>
            <h1>{quiz.title}</h1>
        </Page>
    );
};

export async function getServerSideProps(context) {
    return {
        props: {
            pin: context.params.pin,
        },
    };
}

export default Play;

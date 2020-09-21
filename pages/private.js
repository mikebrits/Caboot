import React from 'react';
import { requiresAuth } from '../src/helpers/withAuth';
import { useAllQuizzes } from '../src/api/quizzes.api';

const Private = ({ user }) => {
    const [quizzes, loading] = useAllQuizzes();
    return (
        <>
            <h1>Private</h1>
            <p>Welcome {user.displayName}</p>
            <ul>
                {!loading &&
                    quizzes &&
                    quizzes.map((quiz, index) => {
                        return <li key={index}>{quiz.title}</li>;
                    })}
            </ul>
        </>
    );
};

export default requiresAuth(Private);

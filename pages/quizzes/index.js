import { requiresAuth } from '../../src/helpers/withAuth';
import { useAllQuizzes } from '../../src/api/quizzes/quizzes.api';
import React from 'react';
import { Page } from '../../src/components/Page';
import Spinner from '../../src/components/Spinner';
import Link from 'next/link';

function Quizzes() {
    const [quizzes, loading] = useAllQuizzes();
    if (loading) return <Spinner />;
    return (
        <Page>
            <ul>
                {quizzes.map((quiz, index) => {
                    console.log(quiz);
                    return (
                        <li key={index}>
                            <Link href={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
                        </li>
                    );
                })}
            </ul>
        </Page>
    );
}

export default requiresAuth(Quizzes);

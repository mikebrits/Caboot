import React from 'react';
import { requiresAuth } from '../../../../src/helpers/withAuth';
import ManageQuiz from '../../../../src/components/pages/ManageQuiz/ManageQuiz';

const Manage = ({ id, gameId }) => {
    console.log({ gameId });
    return <ManageQuiz quizId={id} gameId={gameId} />;
};

export async function getServerSideProps(context) {
    return {
        props: {
            id: context.params.id,
            gameId: context.params.gameId,
        },
    };
}

export default requiresAuth(Manage);

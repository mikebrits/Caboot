import { useEffect } from 'react';
import { gameStatuses, setGameStatus } from '../../../api/game.api';

export const useManageAllQuestionsAnswered = ({ players, loading, game }) => {
    useEffect(() => {
        const allPlayersAnswered = players?.every((p) =>
            p.answers.find((i) => i.questionId === game.currentQuestionId),
        );
        if (!loading && game.status === gameStatuses.answeringQuestion && allPlayersAnswered) {
            setGameStatus(game.id, gameStatuses.allAnswered);
        }
    }, [loading, players]);
};

export const useManageQuestionsFinished = ({ loading, nextQuestion, game }) => {
    useEffect(() => {
        if (
            !loading &&
            !nextQuestion &&
            game.status === gameStatuses.showLeaderboard &&
            game.status !== gameStatuses.ended
        ) {
            setGameStatus(game.id, gameStatuses.questionsFinished);
        }
    }, [nextQuestion, game?.status]);
};

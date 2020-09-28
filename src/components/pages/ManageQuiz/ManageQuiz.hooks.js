import { useEffect } from 'react';
import { gameStatuses, setGameStatus } from '../../../api/game.api';
import { useDeadline } from '../../../helpers/deadlineHooks';

export const useManageAllQuestionsAnswered = ({ players, loading, game }) => {
    useEffect(() => {
        if (!loading && game?.status === gameStatuses.answeringQuestion) {
            const allPlayersAnswered = players?.every((p) =>
                p.answers.find((i) => i.questionId === game.currentQuestionId),
            );
            if (allPlayersAnswered) {
                setGameStatus(game.id, gameStatuses.allAnswered);
            }
        }
    }, [loading, players, game?.status]);
};

export const useManageQuestionDeadline = ({ loading, game }) => {
    useDeadline({
        loading,
        game,
        onExpire: async () => {
            await setGameStatus(game.id, gameStatuses.allAnswered);
        },
    });
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

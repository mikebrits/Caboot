import { useEffect, useState } from 'react';
import { gameStatuses, setGameStatus } from '../../../api/game.api';
import { getTime } from '../../../api/time.api';

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
    const [timer, setTimer] = useState(null);
    useEffect(() => {
        if (!loading && game?.status === gameStatuses.answeringQuestion) {
            getTime().then((time) => {
                const remaining = game.deadline - time;
                if (remaining > 0) {
                    console.log('Timer running', remaining);
                    setTimer(
                        setTimeout(async () => {
                            await setGameStatus(game.id, gameStatuses.allAnswered);
                        }, remaining),
                    );
                } else {
                    setGameStatus(game.id, gameStatuses.allAnswered);
                }
            });
        }
        if (!loading && game?.status === gameStatuses.allAnswered) {
            clearTimeout(timer);
        }
    }, [loading, game?.status]);
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

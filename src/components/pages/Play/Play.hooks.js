import { useDeadline } from '../../../helpers/deadlineHooks';
import { answerQuestion } from '../../../api/game.api';

export const hasPlayerAnsweredCurrentQuestion = (player, game) => {
    return !!player?.answers.find((answer) => answer.questionId === game?.currentQuestionId);
};

export const useManageAutoAnswer = ({ game, loading, player }) => {
    return useDeadline({
        loading,
        game,
        onExpire: async (timeStarted) => {
            if (!hasPlayerAnsweredCurrentQuestion()) {
                await answerQuestion(
                    game.id,
                    player.id,
                    game.currentQuestionId,
                    -1,
                    timeStarted,
                    player.score,
                );
            }
        },
    });
};

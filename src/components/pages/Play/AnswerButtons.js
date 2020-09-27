import React from 'react';
import {
    addAnswerToLocalPlayer,
    getLocalQuestionTimer,
    hasPlayerAnsweredQuestion,
    setLocalQuestionTimer,
} from '../../../helpers/localGameState';
import { answerQuestion } from '../../../api/game.api';
import Button from '@material-ui/core/Button';
import { usePlayerCurrentAnswer } from '../../../api/players.api';

const AnswerButtons = ({ onSubmitAnswer = () => {}, answers, game, player }) => {
    const hasAnswered = () => hasPlayerAnsweredQuestion(game.id, game.currentQuestionId);
    const [answer, setAnswer] = usePlayerCurrentAnswer(game, player);

    const handleSubmitAnswer = async (answerId) => {
        onSubmitAnswer(answerId);
        setAnswer(answerId);
        if (!hasAnswered()) {
            addAnswerToLocalPlayer(game.id, game.currentQuestionId, answerId);
            const score = await answerQuestion(
                game.id,
                player.id,
                game.currentQuestionId,
                answerId,
                getLocalQuestionTimer(game.id),
                player.score,
            );
            setLocalQuestionTimer(game.id, null);
            console.log(score);
        }
    };
    console.log({ answer });
    return (
        <>
            {answers?.map(({ id, text }) => (
                <Button
                    style={{ margin: 16 }}
                    variant={
                        !hasAnswered()
                            ? 'contained'
                            : answer?.answerId === id
                            ? 'contained'
                            : 'outlined'
                    }
                    key={id}
                    color={'primary'}
                    disabled={hasAnswered()}
                    onClick={async () => {
                        await handleSubmitAnswer(id);
                    }}
                >
                    {text}
                </Button>
            ))}
        </>
    );
};

export default AnswerButtons;

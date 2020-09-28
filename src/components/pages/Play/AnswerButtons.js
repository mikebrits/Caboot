import React from 'react';
import { addAnswerToLocalPlayer, setLocalQuestionTimer } from '../../../helpers/localGameState';
import { answerQuestion } from '../../../api/game.api';
import Button from '@material-ui/core/Button';
import { usePlayerCurrentAnswer } from '../../../api/players.api';
import { hasPlayerAnsweredCurrentQuestion } from './Play.hooks';

const AnswerButtons = ({ onSubmitAnswer = () => {}, answers, game, player, disabled }) => {
    const hasAnswered = () => hasPlayerAnsweredCurrentQuestion(player, game);
    const [answer, setAnswer] = usePlayerCurrentAnswer(game, player);

    const handleSubmitAnswer = async (answerId) => {
        onSubmitAnswer(answerId);
        setAnswer(answerId);
        if (!hasAnswered()) {
            addAnswerToLocalPlayer(game.id, game.currentQuestionId, answerId);
            await answerQuestion(game, player, answerId);
            setLocalQuestionTimer(game.id, null);
        }
    };
    return (
        <>
            {answers?.map(({ id, text }) => (
                <Button
                    style={{ margin: 16 }}
                    variant={
                        !disabled ? 'contained' : answer?.answerId === id ? 'contained' : 'outlined'
                    }
                    key={id}
                    color={'primary'}
                    disabled={disabled}
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

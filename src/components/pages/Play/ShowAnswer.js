import React, { useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { usePlayerCurrentAnswer } from '../../../api/players.api';

const ShowAnswer = ({ answers, correctAnswer, game, player, onCorrectAnswer }) => {
    const [answer] = usePlayerCurrentAnswer(game, player);
    useEffect(() => {
        if (answer.answerId === '0') {
            onCorrectAnswer();
        }
    }, [answer]);
    return (
        <>
            {answers?.map(({ id, text }) => {
                const isContained = correctAnswer === text || answer.answerId === id;
                const color = correctAnswer === text ? 'primary' : 'secondary';
                return (
                    <Button
                        style={{ margin: 16 }}
                        color={color}
                        disabled={!isContained}
                        variant={isContained ? 'contained' : 'outlined'}
                        key={id}
                    >
                        {correctAnswer === text && '✅  '} {text}
                    </Button>
                );
            })}
        </>
    );
};

export default ShowAnswer;

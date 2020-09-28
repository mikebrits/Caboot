import React from 'react';
import Button from '@material-ui/core/Button';
import { usePlayerCurrentAnswer } from '../../../api/players.api';

const ShowAnswer = ({ answers, correctAnswer, game, player }) => {
    const [answer] = usePlayerCurrentAnswer(game, player);
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
                        {correctAnswer === text && <>✅</>} {text}
                    </Button>
                );
            })}
        </>
    );
};

export default ShowAnswer;

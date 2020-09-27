import React from 'react';
import Button from '@material-ui/core/Button';
import { useStopQuiz } from '../../../../api/quizzes.api';
import { endGame } from '../../../../api/game.api';

const EndGameButton = ({ game, quiz }) => {
    const stopQuiz = useStopQuiz();
    const handleEndGame = async () => {
        await endGame(game.id);
        await stopQuiz(quiz);
    };
    return (
        <Button color="primary" variant="contained" onClick={handleEndGame}>
            End Game
        </Button>
    );
};

export default EndGameButton;

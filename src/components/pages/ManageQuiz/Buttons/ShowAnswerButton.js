import React from 'react';
import { gameStatuses, setGameStatus } from '../../../../api/game.api';
import Button from '@material-ui/core/Button';

const ShowAnswerButton = ({ game }) => {
    const handleShowAnswer = async () => {
        await setGameStatus(game.id, gameStatuses.showAnswer);
    };

    return (
        <Button color="primary" variant="contained" onClick={handleShowAnswer}>
            Show Answer
        </Button>
    );
};

export default ShowAnswerButton;

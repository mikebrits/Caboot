import React from 'react';
import Button from '@material-ui/core/Button';
import { startGame } from '../../../../api/game.api';

const CloseLobbyButton = ({ game }) => {
    const handleStart = async () => {
        await startGame(game.id);
    };
    return (
        <Button color="primary" variant="contained" onClick={handleStart}>
            Close Lobby
        </Button>
    );
};

export default CloseLobbyButton;

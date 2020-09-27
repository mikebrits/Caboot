import React from 'react';
import Button from '@material-ui/core/Button';
import { showLeaderboard } from '../../../api/game.api';

const ShowLeaderboardButton = ({ game, players }) => {
    const handleShowLeaderBoard = async () => {
        await showLeaderboard(game, players);
        // await moveToNextQuestion(game.id, game.questionIndex, players);
    };
    return (
        <Button color="primary" variant="contained" onClick={handleShowLeaderBoard}>
            Show Leaderboard
        </Button>
    );
};

export default ShowLeaderboardButton;

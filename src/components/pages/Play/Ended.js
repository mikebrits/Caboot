import React from 'react';
import Leaderboard from '../../Leaderboard';

const Ended = ({ game, player }) => {
    return (
        <>
            <Leaderboard leaderboard={game.leaderboard} player={player} over={true} />
        </>
    );
};

export default Ended;

import React from 'react';
import Leaderboard from './Leaderboard';

const Ended = ({ game, player }) => {
    return (
        <>
            <h1>The game is over!</h1>
            <Leaderboard game={game} player={player} />
        </>
    );
};

export default Ended;

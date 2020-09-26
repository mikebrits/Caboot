import React from 'react';

const WaitingToStart = ({ game, player }) => {
    return (
        <>
            <h1>Hey there {player.name}!</h1>
            <p>
                Waiting for the Quiz Master to start the game <b>{game.title}</b>
            </p>
        </>
    );
};

export default WaitingToStart;

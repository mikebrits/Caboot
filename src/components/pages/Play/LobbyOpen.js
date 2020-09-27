import React from 'react';

const LobbyOpen = ({ game, player }) => {
    return (
        <>
            <h1>Hey there {player.name}!</h1>
            <p>
                Waiting for others to join the game <b>{game.title}</b>
            </p>
        </>
    );
};

export default LobbyOpen;

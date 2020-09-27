import React from 'react';
import { gameStatuses } from '../../../api/game.api';

function nth(n) {
    return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

const Leaderboard = ({ player, game }) => {
    const place = game?.leaderboard?.findIndex((item) => item.name === player.name) + 1;
    const over =
        game?.status === gameStatuses.questionsFinished || game?.status === gameStatuses.ended;
    return (
        <>
            <h2>
                You {over ? 'placed' : 'are'} {place + nth(place)}
            </h2>
            <h2>Leaderboard</h2>
            <ul>
                {game?.leaderboard?.map(({ name, score }, key) => (
                    <li key={key} style={{ fontWeight: name === player.name ? 'bold' : 'normal' }}>
                        {name} - {score}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Leaderboard;

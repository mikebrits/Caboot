import React from 'react';

function nth(n) {
    return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

const Leaderboard = ({ player, leaderboard, over = false }) => {
    const place = leaderboard.findIndex((item) => item.name === player.name) + 1;
    return (
        <>
            <h2>
                You {over ? 'placed' : 'are'} {place + nth(place)}
            </h2>
            <h2>Leaderboard</h2>
            <ul>
                {leaderboard?.map(({ name, score }, key) => (
                    <li key={key} style={{ fontWeight: name === player.name ? 'bold' : 'normal' }}>
                        {name} - {score}
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Leaderboard;

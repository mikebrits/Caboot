import React from 'react';
import { gameStatuses } from '../../../api/game.api';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';

function nth(n) {
    return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

// const getPlaces = () => {
//     const places = [];
//     for (let i = 0; i < 5; i++) {
//         places.push(
//             <ListItem style={{ padding: 0 }}>
//                 <Paper style={{ padding: '16px 32px', width: '500px', margin: '4px 0' }}>{i}</Paper>
//             </ListItem>,
//         );
//     }
//     return places;
// };

const Leaderboard = ({ player, game }) => {
    const place = game?.leaderboard?.findIndex((item) => item.name === player.name) + 1;
    const over =
        game?.status === gameStatuses.questionsFinished || game?.status === gameStatuses.ended;
    const placeEmojis = ['🥇', '🥈', '🥉'];
    return (
        <>
            <h2>
                You {over ? 'placed' : 'are'} {place + nth(place)}
            </h2>
            <h2>Leaderboard:</h2>
            <List style={{ maxHeight: '60vh', overflow: 'scroll' }}>
                {game?.leaderboard?.map(({ name, score }, key) => (
                    <ListItem
                        key={key}
                        style={{ fontWeight: name === player.name ? 'bold' : 'normal', padding: 0 }}
                    >
                        <Paper style={{ padding: '16px 32px', width: '500px', margin: '4px 0' }}>
                            {placeEmojis[key] || ''} {name} - {score}
                        </Paper>
                    </ListItem>
                ))}
                {/*{getPlaces()}*/}
            </List>
        </>
    );
};

export default Leaderboard;

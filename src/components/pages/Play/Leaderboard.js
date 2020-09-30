import React from 'react';
import { gameStatuses } from '../../../api/game.api';
import { List } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import Paper from '@material-ui/core/Paper';
import { BsArrowDown, BsArrowUp, BsDash } from 'react-icons/bs';

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
    const placeChange = (playerName, currentPlace) => {
        const previousPlace =
            game?.previousLeaderboard?.findIndex((item) => item.name === playerName) + 1;
        if (!previousPlace || previousPlace === currentPlace) {
            return <BsDash />;
        }
        console.log({ playerName, currentPlace, previousPlace });
        return currentPlace < previousPlace ? <BsArrowUp /> : <BsArrowDown />;
    };
    const over =
        game?.status === gameStatuses.questionsFinished || game?.status === gameStatuses.ended;
    const placeEmojis = ['🥇', '🥈', '🥉'];
    return (
        <>
            <h2>
                You {over ? 'placed' : 'are'} {place + nth(place)}
            </h2>
            <h2>Leaderboard:</h2>
            <List style={{ maxHeight: '60vh', overflow: 'scroll', padding: '0 8px' }}>
                {game?.leaderboard?.map(({ name, score, streak }, key) => (
                    <ListItem
                        key={key}
                        style={{ fontWeight: name === player.name ? 'bold' : 'normal', padding: 0 }}
                    >
                        <Paper
                            elevation={name === player.name ? 5 : 2}
                            style={{
                                padding: '16px 32px',
                                width: '500px',
                                margin: name === player.name ? '12px 0' : '4px 0',
                                background: name === player.name ? '#fbf4d9' : 'white',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    {placeEmojis[key] || ''} {name} - {score}{' '}
                                    {streak > 2 && `🔥 ${streak}`}
                                </div>
                                <div>{placeChange(name, key + 1)}</div>
                            </div>
                        </Paper>
                    </ListItem>
                ))}
            </List>
        </>
    );
};

export default Leaderboard;

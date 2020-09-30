import React from 'react';
import { kickPlayer } from '../../../api/players.api';

const PlayerManager = ({ game, players }) => {
    const playerHasAnsweredQuestion = (playerId, questionId) => {
        const player = players.find((i) => i.id === playerId);
        return !!player.answers.find((i) => i.questionId === questionId);
    };
    const playerHasAnsweredCurrentQuestion = (playerId) => {
        return !!playerHasAnsweredQuestion(playerId, game.currentQuestionId);
    };
    const handleKick = async (playerId) => {
        await kickPlayer(game.id, playerId);
    };

    return (
        <>
            <h3>Players</h3>
            {!players && <p>No players in yet</p>}
            <ul>
                {players &&
                    players
                        .sort((a, b) => b.score - a.score)
                        .map((player) => (
                            <li
                                key={player.id}
                                style={{
                                    color: playerHasAnsweredCurrentQuestion(player.id, game)
                                        ? 'green'
                                        : 'red',
                                }}
                            >
                                {player.streak >= 3 && <b>🔥 {player.streak}</b>} {player.name} -{' '}
                                {player.score}
                                <button onClick={() => handleKick(player.id)}>Kick</button>
                            </li>
                        ))}
            </ul>
        </>
    );
};

export default PlayerManager;

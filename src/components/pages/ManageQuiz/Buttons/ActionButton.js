import React from 'react';
import { gameStatuses } from '../../../../api/game.api';
import CloseLobbyButton from './CloseLobbyButton';
import StartQuestionButton from './StartQuestionButton';
import ShowAnswerButton from './ShowAnswerButton';
import ShowLeaderboardButton from './ShowLeaderboardButton';
import EndGameButton from './EndGameButton';
const gameStateButtonMap = {
    [gameStatuses.lobbyOpen]: CloseLobbyButton,
    [gameStatuses.lobbyClosed]: StartQuestionButton,
    [gameStatuses.allAnswered]: ShowAnswerButton,
    [gameStatuses.showAnswer]: ShowLeaderboardButton,
    [gameStatuses.showLeaderboard]: StartQuestionButton,
    [gameStatuses.questionsFinished]: EndGameButton,
    [gameStatuses.answeringQuestion]: () => <></>,
    [gameStatuses.ended]: () => <></>,
};

const ActionButton = ({ game, quiz, players, nextQuestion }) => {
    const Button = gameStateButtonMap[game.status];
    return <Button game={game} players={players} quiz={quiz} nextQuestion={nextQuestion} />;
};

export default ActionButton;

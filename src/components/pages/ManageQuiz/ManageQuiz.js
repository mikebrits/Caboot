import React, { useEffect } from 'react';
import { requiresAuth } from '../../../helpers/withAuth';
import { gameStatuses, resetCurrentQuiz, setGameStatus } from '../../../api/game.api';
import Spinner from '../../Spinner';
import { useManageQuiz } from '../../../api/quizzes.api';
import Button from '@material-ui/core/Button';
import Error from '../Error';
import PlayerManager from './PlayerManager';
import CloseLobbyButton from './CloseLobbyButton';
import StartQuestionButton from './StartQuestionButton';
import ShowLeaderboardButton from './ShowLeaderboardButton';
import ShowAnswerButton from './ShowAnswerButton';
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

const ManageQuiz = ({ quizId, gameId }) => {
    const [{ players, game, quiz, nextQuestion }, loading, error] = useManageQuiz(quizId, gameId);

    useEffect(() => {
        const allPlayersAnswered = players?.every((p) =>
            p.answers.find((i) => i.questionId === game.currentQuestionId),
        );
        if (!loading && game.status === gameStatuses.answeringQuestion && allPlayersAnswered) {
            setGameStatus(game.id, gameStatuses.allAnswered);
        }
    }, [loading, players]);

    useEffect(() => {
        if (
            !loading &&
            !nextQuestion &&
            game.status === gameStatuses.showLeaderboard &&
            game.status !== gameStatuses.ended
        ) {
            setGameStatus(game.id, gameStatuses.questionsFinished);
        }
    }, [nextQuestion, game?.status]);

    if (loading) return <Spinner />;
    if (error) return <Error title={'Error'} text={error} />;
    if (quiz.game !== gameId) return <Error title={'Quizzes dont match'} />;

    const ActionButton = gameStateButtonMap[game.status];

    return (
        <>
            <h1>Manage Game: {quiz.title}</h1>
            <Button
                color="primary"
                variant="contained"
                onClick={() => resetCurrentQuiz(gameId, game)}
            >
                Reset Game
            </Button>

            <p>Current State: {game.status}</p>

            <p>Game link: https://caboot-zeta.vercel.app/play/{game.pin}</p>
            {nextQuestion ? (
                <>
                    <h3>Next Question:</h3>
                    {nextQuestion.text}
                </>
            ) : (
                <h3>Game over</h3>
            )}

            <div style={{ marginTop: 16 }}>
                <ActionButton
                    quiz={quiz}
                    game={game}
                    players={players}
                    nextQuestion={nextQuestion}
                />
            </div>

            <div>
                <PlayerManager game={game} players={players} />
            </div>
        </>
    );
};

export default requiresAuth(ManageQuiz);

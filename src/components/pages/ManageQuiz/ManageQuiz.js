import React from 'react';
import { requiresAuth } from '../../../helpers/withAuth';
import { resetCurrentQuiz } from '../../../api/game.api';
import Spinner from '../../Spinner';
import { useManageQuiz } from '../../../api/quizzes.api';
import Button from '@material-ui/core/Button';
import Error from '../Error';
import PlayerManager from './PlayerManager';
import ActionButton from './Buttons/ActionButton';
import { useManageAllQuestionsAnswered, useManageQuestionsFinished } from './ManageQuiz.hooks';

const ManageQuiz = ({ quizId, gameId }) => {
    const [{ players, game, quiz, nextQuestion }, loading, error] = useManageQuiz(quizId, gameId);
    useManageAllQuestionsAnswered({ players, loading, game });
    useManageQuestionsFinished({ loading, nextQuestion, game });

    if (loading) return <Spinner />;
    if (error) return <Error title={'Error'} text={error} />;
    // if (quiz.game !== gameId) return <Error title={'Quizzes dont match'} />;

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

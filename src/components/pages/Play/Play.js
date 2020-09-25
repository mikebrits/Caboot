import Error from '../Error';
import React, { useEffect, useState } from 'react';
import { Page } from '../../Page';
import {
    activeQuizStatuses,
    answerQuestion,
    useActiveQuizByPin,
} from '../../../api/activeQuiz.api';
import Spinner from '../../Spinner';
import {
    addAnswerToLocalPlayer,
    getLocalQuestionTimer,
    getPlayerForLocalGame,
    hasPlayerAnsweredQuestion,
    setLocalQuestionTimer,
} from '../../../api/localGameState';
import { useRouter } from 'next/router';
import Leaderboard from '../../Leaderboard';
import Button from '@material-ui/core/Button';
import TimeRemaining from '../../Countdown';

export const QUESTION_DURATION = 20000;

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useActiveQuizByPin(pin);
    const [answers, setAnswers] = useState(null);
    const [submittedAnswer, setSubmittedAnswer] = useState('');
    const [playerScore, setPlayerScore] = useState();
    const router = useRouter();

    const hasAnswered = () => hasPlayerAnsweredQuestion(game.id, game.currentQuestionId);

    useEffect(() => {
        if (game.currentQuestionId && !hasAnswered()) {
            const time = new Date().getTime();
            let timeRemaining = QUESTION_DURATION;
            const localTimer = getLocalQuestionTimer(game.id);
            if (!localTimer) {
                setLocalQuestionTimer(game.id, time);
            } else {
                timeRemaining = QUESTION_DURATION - (time - localTimer);
            }

            setTimeout(() => {
                if (!hasAnswered()) {
                    handleSubmitAnswer('-1');
                }
            }, timeRemaining);
        }
        if (game.answers) {
            setAnswers(
                game.answers
                    .map((text, index) => ({ id: index.toString(), text }))
                    .sort(() => Math.random() - 0.5),
            );
        }
    }, [game.currentQuestion, game.answers]);

    useEffect(() => {
        setPlayerScore(player.score);
    }, [game.showAnswers]);

    const handleSubmitAnswer = async (answerId) => {
        setSubmittedAnswer(game.answers[answerId]);
        if (!hasAnswered()) {
            addAnswerToLocalPlayer(game.id, game.currentQuestionId, answerId);
            const score = await answerQuestion(
                game.id,
                player.id,
                game.currentQuestionId,
                answerId,
                getLocalQuestionTimer(game.id),
                player.score,
            );
            setLocalQuestionTimer(game.id, null);
            console.log(score);
        }
    };

    if (error) {
        return <Error title={'There was an error loading your game'} text={error.toString()} />;
    }

    if (loading) {
        return <Spinner />;
    }

    if (!game) {
        return <Error title={'Quiz Not Found'} />;
    }

    if (!getPlayerForLocalGame(game.id)) {
        router.push(`/play/name?${pin}`);
    }

    if (game.status === activeQuizStatuses.ended) {
        return (
            <Page>
                <Leaderboard leaderboard={game.leaderboard} player={player} over={true} />
            </Page>
        );
    }

    if (game.status === activeQuizStatuses.waiting) {
        return (
            <Page>
                <h1>{game.title}</h1>
                <h2>Waiting for the Quiz Master to start the game...</h2>
            </Page>
        );
    }

    const correctAnswer = game.answers[0];

    return (
        <Page>
            <h1>{game.title}</h1>
            <p>Your Score is: {playerScore}</p>

            {game.currentQuestion && (
                <>
                    <h2>{game.currentQuestion}</h2>

                    {!game.showAnswers &&
                        answers.map((answer) => (
                            <Button
                                style={{ margin: 16 }}
                                variant={
                                    hasAnswered() && submittedAnswer === answer.text
                                        ? 'contained'
                                        : 'outlined'
                                }
                                key={answer.id}
                                disabled={hasAnswered()}
                                onClick={() => {
                                    handleSubmitAnswer(answer.id);
                                }}
                            >
                                {answer.text}
                            </Button>
                        ))}
                    {!hasAnswered() && (
                        <TimeRemaining
                            questionTime={QUESTION_DURATION}
                            key={game.currentQuestionId}
                        />
                    )}
                    {game.showAnswers && (
                        <>
                            <h3 style={{ color: 'green' }}>{correctAnswer}</h3>
                            {correctAnswer !== submittedAnswer && (
                                <h3 style={{ color: 'red' }}>{submittedAnswer}</h3>
                            )}
                            Score:{' '}
                            {
                                player.answers.find((i) => i.questionId === game.currentQuestionId)
                                    ?.score
                            }
                            <Leaderboard leaderboard={game.leaderboard} player={player} />
                        </>
                    )}
                </>
            )}
        </Page>
    );
};

export default Play;

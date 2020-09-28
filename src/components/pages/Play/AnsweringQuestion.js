import React, { useEffect, useState } from 'react';
import TimeRemaining from '../../Countdown';
import { gameStatuses } from '../../../api/game.api';
import AnswerButtons from './AnswerButtons';
import ShowAnswer from './ShowAnswer';
import { hasPlayerAnsweredCurrentQuestion, useCountdown } from './Play.hooks';
import CircularProgress from '@material-ui/core/CircularProgress';

const AnsweringQuestion = ({ game, player }) => {
    const [answers, setAnswers] = useState(null);

    const countDownTime = useCountdown({ game });

    useEffect(() => {
        if (game.answers) {
            setAnswers(
                game.answers
                    .map((text, index) => ({ id: index.toString(), text }))
                    .sort(() => Math.random() - 0.5),
            );
        }
    }, [game.currentQuestionId]);

    const correctAnswer = game.answers[0];

    if (countDownTime > 0 && game.status === gameStatuses.answeringQuestion)
        return (
            <>
                <CircularProgress variant="static" value={(countDownTime / 3000) * 100} />
                <h2>Get Ready!</h2>
            </>
        );

    const showTimer = !hasPlayerAnsweredCurrentQuestion(player, game);

    return (
        <>
            {game.currentQuestion && (
                <>
                    {showTimer && (
                        <TimeRemaining
                            questionTime={game.questionDuration}
                            key={game.currentQuestionId}
                        />
                    )}
                    <h2>{game.currentQuestion}</h2>

                    {(game.status === gameStatuses.answeringQuestion ||
                        game.status === gameStatuses.allAnswered) && (
                        <AnswerButtons
                            answers={answers}
                            game={game}
                            player={player}
                            disabled={
                                game.status === gameStatuses.allAnswered ||
                                hasPlayerAnsweredCurrentQuestion(player, game)
                            }
                        />
                    )}

                    {game.status === gameStatuses.showAnswer && (
                        <>
                            <ShowAnswer
                                answers={answers}
                                game={game}
                                player={player}
                                correctAnswer={correctAnswer}
                            />
                            <p>
                                You scored:{' '}
                                {
                                    player.answers.find(
                                        (i) => i.questionId === game.currentQuestionId,
                                    )?.score
                                }
                            </p>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default AnsweringQuestion;

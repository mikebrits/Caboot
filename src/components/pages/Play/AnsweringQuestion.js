import React, { useEffect, useState } from 'react';
import TimeRemaining from '../../Countdown';
import {
    getLocalQuestionTimer,
    hasPlayerAnsweredQuestion,
    setLocalQuestionTimer,
} from '../../../helpers/localGameState';
import { gameStatuses } from '../../../api/game.api';
import AnswerButtons from './AnswerButtons';
import ShowAnswer from './ShowAnswer';

const AnsweringQuestion = ({ game, player }) => {
    const [answers, setAnswers] = useState(null);
    const [playerScore, setPlayerScore] = useState();
    const hasAnswered = () => hasPlayerAnsweredQuestion(game.id, game.currentQuestionId);

    useEffect(() => {
        if (game.currentQuestionId && !hasAnswered()) {
            const time = new Date().getTime();
            let timeRemaining = game.questionDuration;
            const localTimer = getLocalQuestionTimer(game.id);
            if (!localTimer) {
                setLocalQuestionTimer(game.id, time);
            } else {
                timeRemaining = game.questionDuration - (time - localTimer);
            }

            setTimeout(() => {
                if (!hasAnswered()) {
                    //handleSubmitAnswer('-1');
                    // TODO: Handle auto submit
                }
            }, timeRemaining);
        }
    }, [game.currentQuestion]);

    useEffect(() => {
        console.log({ game });
        if (game.answers) {
            setAnswers(
                game.answers
                    .map((text, index) => ({ id: index.toString(), text }))
                    .sort(() => Math.random() - 0.5),
            );
        }
    }, [game.answers]);

    useEffect(() => {
        setPlayerScore(player.score);
    }, [game.showAnswers]);

    const correctAnswer = game.answers[0];

    return (
        <>
            <h1>{game.title}</h1>
            <p>Your Score is: {playerScore}</p>

            {game.currentQuestion && (
                <>
                    <h2>{game.currentQuestion}</h2>

                    {(game.status === gameStatuses.answeringQuestion ||
                        game.status === gameStatuses.allAnswered) && (
                        <AnswerButtons answers={answers} game={game} player={player} />
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
                    {!hasAnswered() && (
                        <TimeRemaining
                            questionTime={game.questionDuration}
                            key={game.currentQuestionId}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default AnsweringQuestion;

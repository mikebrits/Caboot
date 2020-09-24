import Error from '../Error';

export * from './Play';
import React, { useEffect, useState } from 'react';
import { Page } from '../../Page';
import { answerQuestion, useActiveQuizByPin } from '../../../api/activeQuiz.api';
import Spinner from '../../Spinner';
import { getPlayerForLocalGame } from '../../../api/localGameState';
import { useRouter } from 'next/router';

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useActiveQuizByPin(pin);
    const [answers, setAnswers] = useState(null);
    const [offset, setOffset] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [startTime, setStartTime] = useState(0);
    const [questionAnswered, setQuestionAnswered] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (game && game.currentQuestionId && game.currentQuestionId !== currentQuestion) {
            setCurrentQuestion(game.question);
            setQuestionAnswered(false);
            const startedAt = new Date(game.currentQuestionStartedAt.seconds * 1000);
            const now = new Date();
            setOffset(now.getTime() - startedAt.getTime());
        }
        if (game.answers) {
            setAnswers(
                game.answers
                    .map((text, index) => ({ id: index.toString(), text }))
                    .sort(() => Math.random() - 0.5),
            );
        }
    }, [game.currentQuestion, game.answers]);

    const handleSubmitAnswer = async (answerId) => {
        if (!questionAnswered) {
            setQuestionAnswered(true);
            await answerQuestion(
                game.id,
                player.id,
                game.currentQuestionId,
                answerId,
                game.currentQuestionStartedAt,
                offset,
                player.score,
            );
        }
    };

    if (error) {
        return <Error title={'There was an error loading your game'} />;
    }

    if (!getPlayerForLocalGame(game.id)) {
        router.push(`/play/name?${pin}`);
    }

    if (loading) {
        return <Spinner />;
    }

    if (!game) {
        return <Error title={'Quiz Not Found'} />;
    }

    return (
        <Page>
            <h1>{game.title}</h1>
            <p>Your name is {player.name}</p>
            <p>Game status: {game.status}</p>

            {game.currentQuestion && (
                <>
                    <h2>{game.currentQuestion}</h2>

                    {answers.map((answer) => (
                        <button
                            disabled={questionAnswered}
                            onClick={() => {
                                handleSubmitAnswer(answer.id);
                            }}
                        >
                            {answer.text}
                        </button>
                    ))}
                </>
            )}
        </Page>
    );
};

export default Play;

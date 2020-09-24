import Error from '../Error';
import React, {useEffect, useState} from 'react';
import { Page } from '../../Page';
import { answerQuestion, useActiveQuizByPin } from '../../../api/activeQuiz.api';
import Spinner from '../../Spinner';
import {
    addAnswerToLocalPlayer, getLocalQuestionTimer,
    getPlayerForLocalGame,
    hasPlayerAnsweredQuestion,
    setLocalQuestionTimer
} from '../../../api/localGameState';
import { useRouter } from 'next/router';

const QUESTION_DURATION = 10000;

const Play = ({ pin }) => {
    const [{ player, game }, loading, error] = useActiveQuizByPin(pin);
    const [answers, setAnswers] = useState(null);
    const router = useRouter();

    const hasAnswered = () => hasPlayerAnsweredQuestion(game.id, game.currentQuestionId)

    useEffect(() => {
        if (game.currentQuestionId && !hasAnswered()) {
            const time = (new Date()).getTime();
            let timeRemaining = QUESTION_DURATION;
            const localTimer = getLocalQuestionTimer(game.id);
            if(!localTimer){
                setLocalQuestionTimer(game.id, time);
            } else {
                timeRemaining = QUESTION_DURATION - (time - localTimer);
            }

            setTimeout(() => {
                if(!hasAnswered()){
                    handleSubmitAnswer("-1");
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



    const handleSubmitAnswer = async (answerId) => {
        if (!hasAnswered()) {
            addAnswerToLocalPlayer(game.id, game.currentQuestionId, answerId);
            setLocalQuestionTimer(game.id, null);
            const score = await answerQuestion(
                game.id,
                player.id,
                game.currentQuestionId,
                answerId,
                getLocalQuestionTimer(game.id),
                player.score,
            );
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

    return (
        <Page>
            <h1>{game.title}</h1>
            <p>Your name is {player.name}</p>
            <p>Game status: {game.status}</p>
            <p>Have answered: {hasAnswered().toString()}</p>

            {game.currentQuestion && (
                <>
                    <h2>{game.currentQuestion}</h2>

                    {answers.map((answer) => (
                        <button
                            key={answer.id}
                            disabled={hasAnswered()}
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

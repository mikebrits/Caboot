import { useDeadline } from '../../../helpers/deadlineHooks';
import { answerQuestion, gameStatuses } from '../../../api/game.api';
import React, { useEffect, useRef, useState } from 'react';
import { getTime } from '../../../api/time.api';

export const hasPlayerAnsweredCurrentQuestion = (player, game) => {
    return !!player?.answers.find((answer) => answer.questionId === game?.currentQuestionId);
};

export const useManageAutoAnswer = ({ game, loading, player }) => {
    return useDeadline({
        loading,
        game,
        onExpire: async () => {
            if (!hasPlayerAnsweredCurrentQuestion()) {
                await answerQuestion(game, player, -1);
            }
        },
    });
};

export const useCountdown = ({ game }) => {
    const [countDownTime, setCountDownTime] = useState(3000);
    const [timer, setTimer] = useState(null);
    const INTERVAL = 100;
    const savedCallback = useRef();

    useEffect(() => {
        savedCallback.current = () => {
            setCountDownTime((time) => {
                if (time <= 0) {
                    setTimer((t) => {
                        clearInterval(t);
                    });
                    clearInterval(timer);
                    return 0;
                } else {
                    return time - INTERVAL;
                }
            });
        };
    }, []);

    function tick() {
        savedCallback.current();
    }

    useEffect(() => {
        if (game?.status === gameStatuses.answeringQuestion) {
            (async () => {
                const time = await getTime();
                const remaining = game.deadline - game.questionDuration - time;
                setCountDownTime(remaining);
                if (remaining >= 1000) {
                    const id = setInterval(tick, INTERVAL);
                    setTimer(id);
                } else {
                    setCountDownTime(0);
                }
            })();
            return () => clearInterval(timer);
        }
    }, [game?.status]);

    return countDownTime;
};

// function useInterval(callback, delay) {
//     const savedCallback = useRef();
//     // Remember the latest callback.
//     useEffect(() => {
//         savedCallback.current = callback;
//     }, [callback]);
//     // Set up the interval.
//     useEffect(() => {
//         function tick() {
//             savedCallback.current();
//         }
//         if (delay !== null) {
//             let id = setInterval(tick, delay);
//             return () => clearInterval(id);
//         }
//     }, [delay]);
// }

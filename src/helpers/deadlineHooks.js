import { useEffect, useState } from 'react';
import { gameStatuses } from '../api/game.api';
import { getTime } from '../api/time.api';

export const useDeadline = ({ loading, game, onExpire }) => {
    const [timer, setTimer] = useState(null);
    useEffect(() => {
        if (!loading && game?.status === gameStatuses.answeringQuestion) {
            getTime().then((time) => {
                const remaining = game.deadline - time;
                if (remaining > 0) {
                    setTimer(
                        setTimeout(async () => {
                            await onExpire(time, game.deadline);
                        }, remaining),
                    );
                } else {
                    onExpire(time, game.deadline);
                }
            });
        }
        if (!loading && game?.status === gameStatuses.allAnswered) {
            clearTimeout(timer);
        }
    }, [loading, game?.status]);
};

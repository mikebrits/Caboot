import React, { useEffect, useState } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

// const QUESTION_TIME = 10000;
const INTERVAL = 100;

// function pad(n, width, z) {
//     z = z || '0';
//     n = n + '';
//     return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
// }

export default function TimeRemaining({ questionTime }) {
    const [timeRemaining, setTimeRemaining] = useState(questionTime);
    useEffect(() => {
        const interval = setInterval(() => {
            if (timeRemaining - INTERVAL > 0) {
                setTimeRemaining(timeRemaining - INTERVAL);
            } else {
                setTimeRemaining(0);
            }
        }, INTERVAL);

        return () => clearInterval(interval);
    }, [timeRemaining]);

    // const renderTimeRemaining = () => {
    //     const mins = Math.floor(timeRemaining / 1000 / 60);
    //     const seconds = Math.floor(timeRemaining / 1000);
    //     const ms = timeRemaining % 1000;
    //
    //     return `${pad(mins, 2)}:${pad(seconds, 2)}:${pad(ms, 3)}`;
    // };

    return (
        <div>
            <CircularProgress variant="static" value={(timeRemaining / questionTime) * 100} />
        </div>
    );
}

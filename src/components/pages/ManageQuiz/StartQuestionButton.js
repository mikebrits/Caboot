import React from 'react';
import Button from '@material-ui/core/Button';
import { setCurrentQuestion } from '../../../api/game.api';

const StartQuestionButton = ({ game, nextQuestion }) => {
    const askQuestion = async () => {
        const question = nextQuestion;
        await setCurrentQuestion(game.id, question.id, question.text, question.answers);
    };
    return (
        <Button color="primary" variant="contained" onClick={askQuestion}>
            Start Question
        </Button>
    );
};

export default StartQuestionButton;

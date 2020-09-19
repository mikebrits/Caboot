import React from 'react';
import { TextInput } from 'grommet';

const EditQuestion = ({ question }) => {
    return (
        <>
            <p>{question.text}</p>
            {question.answers.map((answer, index) => {
                return (
                    <TextInput
                        key={index}
                        placeholder="Enter your answer"
                        value={answer}
                        onChange={() => {}}
                    />
                );
            })}
        </>
    );
};

export default EditQuestion;

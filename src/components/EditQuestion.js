import React from 'react';
import { BsPlusCircle, BsTrash } from 'react-icons/bs';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Card from '@material-ui/core/Card';
import { CardContent } from '@material-ui/core';
import PopoverButton from './PopoverButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

const EditQuestion = ({ question, id, onChange, index, onDelete }) => {
    const handleAnswerChange = (index, text) => {
        onChange(id, {
            ...question,
            answers: question.answers.map((item, ind) => (ind === index ? text : item)),
        });
    };
    const handleQuestionChange = (text) => {
        onChange(id, { ...question, text });
    };

    const handleAddAnswer = () => {
        onChange(id, { ...question, answers: [...(question.answers || []), ''] });
    };

    const handleRemoveAnswer = (index) => {
        onChange(id, {
            ...question,
            answers: (question.answers || []).filter((item, ind) => index !== ind),
        });
    };

    return (
        <Card variant="outlined" style={{ margin: 16 }}>
            <CardContent>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>Question {index}</h2>
                    <PopoverButton>
                        <List>
                            <ListItem
                                button
                                onClick={() => {
                                    onDelete(question.id);
                                }}
                            >
                                <ListItemIcon>
                                    <BsTrash />
                                </ListItemIcon>
                                <ListItemText primary="Delete Question" />
                            </ListItem>
                        </List>
                    </PopoverButton>
                </div>
                <TextField
                    id="standard-basic"
                    label={'Question Text'}
                    value={question.text}
                    onChange={(e) => handleQuestionChange(e.target.value)}
                />
                <h3>Answers:</h3>

                {question.answers &&
                    question.answers.map((answer, index) => {
                        return (
                            <div style={{ marginBottom: 16 }}>
                                <TextField
                                    id="standard-basic"
                                    key={index}
                                    label={index === 0 ? 'Correct Answer:' : `Answer ${index + 1}:`}
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                />
                                {index > 0 && (
                                    <IconButton
                                        size="small"
                                        aria-label="delete answer"
                                        onClick={() => handleRemoveAnswer(index)}
                                    >
                                        <BsTrash />
                                    </IconButton>
                                )}
                            </div>
                        );
                    })}
                <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<BsPlusCircle />}
                    onClick={handleAddAnswer}
                >
                    Add Answer
                </Button>
            </CardContent>
        </Card>
    );
};

export default EditQuestion;

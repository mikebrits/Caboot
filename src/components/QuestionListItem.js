import React, { useState } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';
import { BsChevronUp, BsChevronDown, BsStarFill } from 'react-icons/bs';
import { FaTimes } from 'react-icons/fa';
import ListItemIcon from '@material-ui/core/ListItemIcon';

const QuestionListItem = ({ question }) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <ListItem
                key={question.id}
                onClick={() => {
                    setOpen(!open);
                }}
            >
                <ListItemText>
                    <b>{question.text}</b>
                </ListItemText>
                {open ? <BsChevronDown /> : <BsChevronUp />}
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding style={{ marginLeft: 16 }}>
                    {question.answers.map((answer, index) => {
                        return (
                            <ListItem key={index}>
                                <ListItemIcon>
                                    {index === 0 ? <BsStarFill /> : <FaTimes />}
                                </ListItemIcon>
                                <ListItemText>{answer}</ListItemText>
                            </ListItem>
                        );
                    })}
                </List>
            </Collapse>
        </>
    );
};

export default QuestionListItem;

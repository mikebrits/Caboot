import { requiresAuth } from '../../src/helpers/withAuth';
import { useAllQuizzes, useDeleteQuiz } from '../../src/api/quizzes.api';
import React from 'react';
import { Page } from '../../src/components/Page';
import Spinner from '../../src/components/Spinner';
import Link from 'next/link';
import NewQuiz from '../../src/components/NewQuiz';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import { BsTrash, BsPencil, BsPlay } from 'react-icons/bs';
import { toast } from 'react-toastify';

function Quizzes() {
    const [quizzes, loading] = useAllQuizzes();
    const deleteQuiz = useDeleteQuiz();

    const handleDeleteQuiz = async (id) => {
        await deleteQuiz(id);
        toast.success('Quiz Deleted');
    };
    if (loading) return <Spinner />;
    return (
        <Page>
            <List>
                {quizzes.map((quiz) => {
                    return (
                        <ListItem key={quiz.id}>
                            <ListItemText>
                                <Link href={`/quizzes/${quiz.id}`}>{quiz.title}</Link>
                            </ListItemText>
                            <ListItemSecondaryAction>
                                <IconButton size={'small'}>
                                    <BsPlay />
                                </IconButton>
                                <Link href={`/quizzes/${quiz.id}/edit`}>
                                    <IconButton size={'small'}>
                                        <BsPencil />
                                    </IconButton>
                                </Link>
                                <IconButton
                                    size={'small'}
                                    onClick={() => handleDeleteQuiz(quiz.id)}
                                >
                                    <BsTrash />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    );
                })}
            </List>
            <NewQuiz />
        </Page>
    );
}

export default requiresAuth(Quizzes);

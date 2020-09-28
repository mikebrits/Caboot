import React from 'react';
import { requiresAuth } from '../../../src/helpers/withAuth';
import { quizStatuses, useDeleteQuiz, useQuiz, useStartQuiz } from '../../../src/api/quizzes.api';
import Spinner from '../../../src/components/Spinner';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router';
import List from '@material-ui/core/List';
import QuestionListItem from '../../../src/components/QuestionListItem';
import { BsPencil, BsPlay, BsTrash, BsGear } from 'react-icons/bs/index';
import Error from '../../../src/components/pages/Error';
import { useQuestions } from '../../../src/api/questions.api';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
}));

function Quiz({ id }) {
    const [quiz, loading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);
    const classes = useStyles();
    const deleteQuiz = useDeleteQuiz();
    const router = useRouter();
    const startQuiz = useStartQuiz();

    const handleDelete = async () => {
        await deleteQuiz(id);
        await router.push('/quizzes');
    };

    const handleStartGame = () => {
        startQuiz(id);
    };

    if (loading || questionsLoading) return <Spinner />;

    if (!quiz) return <Error title={'Quiz not found'} />;

    return (
        <div>
            <div className={classes.header}>
                <h1>{quiz.title}</h1>
                <div className={classes.root}>
                    {quiz.status === quizStatuses.idle && (
                        <Button
                            onClick={handleStartGame}
                            variant="contained"
                            startIcon={<BsPlay />}
                            color="primary"
                        >
                            Start
                        </Button>
                    )}
                    {quiz.status === quizStatuses.inProgress ||
                        (quiz.status === quizStatuses.waiting && (
                            <Button
                                onClick={() => {
                                    router.push(`/quizzes/${id}/manage/${quiz.game}`);
                                }}
                                variant="contained"
                                startIcon={<BsGear />}
                                color="primary"
                            >
                                Manage
                            </Button>
                        ))}

                    <Button
                        onClick={() => {
                            router.push(`/quizzes/${id}/edit`);
                        }}
                        startIcon={<BsPencil />}
                        variant="outlined"
                        color="primary"
                    >
                        Edit
                    </Button>

                    <Button
                        startIcon={<BsTrash />}
                        variant="outlined"
                        color="primary"
                        onClick={handleDelete}
                    >
                        Delete
                    </Button>
                </div>
            </div>

            <List>
                {quiz.questionOrder
                    .map((id) => questions.find((i) => i.id === id))
                    .map((item) => item && <QuestionListItem key={item.id} question={item} />)}
            </List>
        </div>
    );
}

export async function getServerSideProps(context) {
    return {
        props: {
            id: context.params.id,
        },
    };
}

export default requiresAuth(Quiz);

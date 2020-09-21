import React from 'react';
import { requiresAuth } from '../../../src/helpers/withAuth';
import { Page } from '../../../src/components/Page';
import { useDeleteQuiz, useQuestions, useQuiz } from '../../../src/api/quizzes.api';
import Spinner from '../../../src/components/Spinner';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Button from '@material-ui/core/Button';
import Link from 'next/link';
import { useRouter } from 'next/router';
import List from '@material-ui/core/List';
import QuestionListItem from '../../../src/components/QuestionListItem';
import { BsPencil, BsPlay, BsTrash } from 'react-icons/bs/index';

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
    const handleDelete = async () => {
        console.log({ id });
        await deleteQuiz(id);
        await router.push('/quizzes');
    };

    if (loading || questionsLoading) return <Spinner />;

    if (!quiz)
        return (
            <Page>
                <h1>Quiz not found</h1>
            </Page>
        );

    return (
        <Page>
            <div className={classes.header}>
                <h1>{quiz.title}</h1>
                <div className={classes.root}>
                    <Button variant="contained" startIcon={<BsPlay />} color="primary">
                        Start
                    </Button>
                    <Link href={`/quizzes/${id}/edit`}>
                        <Button startIcon={<BsPencil />} variant="outlined" color="primary">
                            Edit
                        </Button>
                    </Link>
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

            <List>{questions.map((item) => item && <QuestionListItem question={item} />)}</List>
        </Page>
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

import React, { useState } from 'react';
import { requiresAuth } from '../../../src/helpers/withAuth';
import { Page } from '../../../src/components/Page';
import {
    useAddQuestion,
    useDeleteQuestion,
    useQuestions,
    useQuiz,
    useSaveQuizQuestions,
} from '../../../src/api/quizzes.api';
import Spinner from '../../../src/components/Spinner';
import EditQuestion from '../../../src/components/EditQuestion';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';

function Quiz({ id }) {
    const [quiz, loading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);
    const [editQuestions, setEditQuestions] = useState([]);
    const saveQuestions = useSaveQuizQuestions(id);
    const addQuestion = useAddQuestion(id);
    const deleteQuestion = useDeleteQuestion(id);

    const handleUpdateQuestion = (id, question) => {
        if (editQuestions.find((item) => item.id === id)) {
            setEditQuestions(
                editQuestions.map((item) => {
                    if (item.id === id) {
                        return question;
                    }
                    return item;
                }),
            );
        } else {
            setEditQuestions([...editQuestions, question]);
        }
    };

    const handleSave = async () => {
        await saveQuestions(editQuestions);
        setEditQuestions([]);
        toast.success('Quiz Saved');
    };

    const handleDelete = (id) => {
        deleteQuestion(id);
    };

    const handleAddQuestion = () => {
        addQuestion();
    };

    if (loading || questionsLoading) return <Spinner />;

    const filteredQuestions = questions.map((question) => {
        return editQuestions.find((i) => i.id === question.id) || question;
    });

    const collatedQuestions = [...filteredQuestions, ...editQuestions.filter((i) => !i.id)];
    return (
        <Page>
            <h1>{quiz.title}</h1>
            {questionsLoading ? (
                <Spinner />
            ) : (
                collatedQuestions.map(
                    (item, index) =>
                        item && (
                            <EditQuestion
                                question={item}
                                id={item.id}
                                onChange={handleUpdateQuestion}
                                onDelete={handleDelete}
                                key={item.id}
                                index={index + 1}
                            />
                        ),
                )
            )}
            <Button variant="contained" color="primary" onClick={handleAddQuestion}>
                Add Question
            </Button>
            <hr />
            <Button variant="contained" color="primary" onClick={handleSave}>
                SaveQuiz
            </Button>
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

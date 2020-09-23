import React, { useState } from 'react';
import { requiresAuth } from '../../../src/helpers/withAuth';
import { Page } from '../../../src/components/Page';
import {
    useAddQuestion,
    useDeleteQuestion,
    useQuestions,
    useQuiz,
    useSaveQuizQuestions,
    useUpdateQuestionOrder,
} from '../../../src/api/quizzes.api';
import Spinner from '../../../src/components/Spinner';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import { BsPlusCircle } from 'react-icons/bs';
import EditQuestionList from '../../../src/components/EditQuestionList';

function Quiz({ id }) {
    const [quiz, loading] = useQuiz(id);
    const [questions, questionsLoading] = useQuestions(id);
    const [editQuestions, setEditQuestions] = useState([]);
    const [order, setOrder] = useState(null);
    const saveQuestions = useSaveQuizQuestions(id);
    const addQuestion = useAddQuestion(id);
    const deleteQuestion = useDeleteQuestion(id);
    const updateOrder = useUpdateQuestionOrder(id);

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
        if (order) {
            await updateOrder(order);
        }
        setEditQuestions([]);
        toast.success('Quiz Saved');
    };

    const handleDeleteQuestion = (id) => {
        deleteQuestion(id);
    };

    const handleAddQuestion = () => {
        addQuestion();
    };

    const handleReorder = (order) => {
        setOrder(order);
        // updateOrder(order);
    };

    if (loading || questionsLoading) return <Spinner />;

    const filteredQuestions = questions.map((question) => {
        return editQuestions.find((i) => i.id === question.id) || question;
    });

    return (
        <Page>
            <h1>{quiz.title}</h1>

            <EditQuestionList
                order={order || quiz.questionOrder}
                questions={filteredQuestions}
                onQuestionChange={handleUpdateQuestion}
                onQuestionDelete={handleDeleteQuestion}
                onReorder={handleReorder}
            />

            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    startIcon={<BsPlusCircle />}
                    variant="outlined"
                    color="primary"
                    onClick={handleAddQuestion}
                >
                    Add Question
                </Button>
            </div>
            <hr />
            <Button variant="contained" color="primary" onClick={handleSave}>
                Save Quiz
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

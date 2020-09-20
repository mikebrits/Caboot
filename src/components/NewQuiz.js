import React, { useState } from 'react';
import { BsPlusCircle } from 'react-icons/bs';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useCreateQuiz } from '../api/quizzes/quizzes.api';
import { toast, ToastContainer } from 'react-toastify';

const NewQuiz = () => {
    const [addingNewQuiz, setAddingNewQuiz] = useState(false);
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const createQuiz = useCreateQuiz();

    const handleCreateQuiz = async () => {
        if (name) {
            createQuiz(name);
            setName('');
            setError('');
            setAddingNewQuiz(false);
            toast.success('Quiz Created!');
        } else {
            setError('Please enter a name');
        }
    };
    if (!addingNewQuiz)
        return (
            <>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<BsPlusCircle />}
                    onClick={() => setAddingNewQuiz(true)}
                >
                    Add new Quiz
                </Button>
                <ToastContainer
                    position="bottom-center"
                    autoClose={1500}
                    hideProgressBar
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    pauseOnHover
                />
            </>
        );

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateQuiz();
                }}
            >
                <TextField
                    label={'New Quiz Name'}
                    error={!!error}
                    helperText={error}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </form>
            <br />
            <Button
                variant="contained"
                color="primary"
                startIcon={<BsPlusCircle />}
                onClick={handleCreateQuiz}
            >
                Save New Quiz
            </Button>
        </>
    );
};

export default NewQuiz;

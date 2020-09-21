import { db } from '../config/firebase';

const activeQuizCollectionRef = db.collection('active-quizzes');

export const activeQuizStatuses = {
    inProgress: 'IN_PROGRESS',
    ended: 'ENDED',
    waiting: 'WAITING',
};

const defaultActiveQuiz = () => ({
    status: activeQuizStatuses.waiting,
    pin: Math.floor(Math.random() * 100000),
});

const createActiveQuiz = () => {};

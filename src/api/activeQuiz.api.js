import { db } from '../config/firebase';
import { useUser } from '../helpers/UserContext';
import { useCollection, useRealtimeCollection, useRealtimeDoc } from './query';

const activeQuizCollectionRef = () => db.collection('active-quizzes');
const activeQuizRef = (id) => activeQuizCollectionRef().doc(id);
const activeQuizByPin = (pin) => activeQuizCollectionRef().where('pin', '==', pin);

export const activeQuizStatuses = {
    inProgress: 'IN_PROGRESS',
    ended: 'ENDED',
    waiting: 'WAITING',
};

const defaultActiveQuiz = () => ({
    status: activeQuizStatuses.waiting,
    pin: Math.floor(Math.random() * 100000),
});

export const createActiveQuiz = async (details = {}) => {
    const quiz = { ...defaultActiveQuiz(), ...details };
    const doc = await activeQuizCollectionRef().add(quiz);
    return {
        id: doc.id,
        ...quiz,
    };
};

export const useActiveQuiz = (id) => {
    return useRealtimeDoc(activeQuizRef(id));
};

export const useCreateActiveQuiz = () => {
    const { user } = useUser();
    return async (details) => createActiveQuiz({ owner: user.uid, ...details });
};

export const updateActiveQuiz = async (id, data) => {
    await activeQuizRef(id).update(data);
};

export const startActiveQuiz = async (id) => {
    await updateActiveQuiz(id, { status: activeQuizStatuses.inProgress });
};

export const endActiveQuiz = async (id) => {
    await updateActiveQuiz(id, { status: activeQuizStatuses.ended });
};

export const useActiveQuizByPin = (pin) => {
    return useRealtimeCollection(activeQuizByPin(pin));
};

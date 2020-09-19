import { db } from '../../config/firebase';
import { useDoc, useCollection } from '../query';
import { useUser } from '../../helpers/UserContext';

export const userRef = (id) => db.collection('users').doc(id);
export const quizCollectionRef = (userId) => userRef(userId).collection('quizzes');
export const quizRef = (userId, quizId) => quizCollectionRef(userId).doc(quizId);
export const questionsRef = (userId, quizId) => quizRef(userId, quizId).collection('questions');

export const useQuiz = (quizId) => {
    const { user } = useUser();
    return useDoc(quizRef(user.uid, quizId));
};

export const useAllQuizzes = () => {
    const { user } = useUser();
    return useCollection(quizCollectionRef(user.uid));
};

export const useQuestions = (quizId) => {
    const { user } = useUser();
    return useCollection(questionsRef(user.uid, quizId));
};

export const startQuiz = async (userId, quizId) => {};

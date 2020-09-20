import { db } from '../../config/firebase';
import { useDoc, useRealtimeCollection } from '../query';
import { useUser } from '../../helpers/UserContext';

export const userRef = (id) => db.collection('users').doc(id);
export const quizCollectionRef = (userId) => userRef(userId).collection('quizzes');
export const quizRef = (userId, quizId) => quizCollectionRef(userId).doc(quizId);
export const questionCollectionRef = (userId, quizId) =>
    quizRef(userId, quizId).collection('questions');
export const questionRef = (userId, quizId, questionId) =>
    questionCollectionRef(userId, quizId).doc(questionId);

export const useQuiz = (quizId) => {
    const { user } = useUser();
    return useDoc(quizRef(user.uid, quizId));
};

export const useAllQuizzes = () => {
    const { user } = useUser();
    return useRealtimeCollection(quizCollectionRef(user.uid));
};

export const useQuestions = (quizId) => {
    const { user } = useUser();
    return useRealtimeCollection(questionCollectionRef(user.uid, quizId));
};

export const getNewQuestion = () => ({
    title: '',
    answers: [],
});

export const useAddQuestion = (quizId) => {
    const { user } = useUser();
    return async (data = {}) => {
        const question = {
            ...getNewQuestion(),
            ...data,
        };
        const doc = await questionCollectionRef(user.uid, quizId).add(question);
        return { id: doc.id, ...question };
    };
};

export const useDeleteQuestion = (quizId) => {
    const { user } = useUser();
    return async (questionId) => {
        await questionRef(user.uid, quizId, questionId).delete();
    };
};

export const useSaveQuizQuestions = (quizId) => {
    const { user } = useUser();
    return async (questions) => {
        const batch = db.batch();
        questions.forEach((question) => {
            const ref = question.id
                ? questionRef(user.uid, quizId, question.id)
                : questionCollectionRef(user.uid, quizId).doc();

            batch.set(ref, question);
        });
        await batch.commit();
    };
};

export const useCreateQuiz = () => {
    const { user } = useUser();
    return async (title) => {
        const doc = await quizCollectionRef(user.uid).add({ title });
        return { id: doc.uid, title };
    };
};

export const useDeleteQuiz = () => {
    const { user } = useUser();
    return async (quizId) => {
        return await quizRef(user.uid, quizId).delete();
    };
};

export const startQuiz = async (userId, quizId) => {};

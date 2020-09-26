import { useUser } from '../helpers/UserContext';
import * as firebase from 'firebase';
import { useRealtimeCollection } from './query';
import { db } from '../config/firebase';
import { quizRef } from './quizzes.api';

export const questionCollectionRef = (userId, quizId) =>
    quizRef(userId, quizId).collection('questions');
export const questionRef = (userId, quizId, questionId) =>
    questionCollectionRef(userId, quizId).doc(questionId);
export const useQuestions = (quizId) => {
    const { user } = useUser();
    return useRealtimeCollection(questionCollectionRef(user.uid, quizId));
};

export const getNewQuestion = () => ({
    text: '',
    answers: [],
    answer: '0',
});

export const useAddQuestion = (quizId) => {
    const { user } = useUser();
    return async (data = {}) => {
        const question = {
            ...getNewQuestion(),
            ...data,
        };
        const doc = await questionCollectionRef(user.uid, quizId).add(question);
        await quizRef(user.uid, quizId).update({
            questionOrder: firebase.firestore.FieldValue.arrayUnion(doc.id),
        });
        return { id: doc.id, ...question };
    };
};

export const useDeleteQuestion = (quizId) => {
    const { user } = useUser();
    return async (questionId) => {
        await questionRef(user.uid, quizId, questionId).delete();
        await quizRef(user.uid, quizId).update({
            questionOrder: firebase.firestore.FieldValue.arrayRemove(questionId),
        });
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

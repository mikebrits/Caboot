import { db } from '../config/firebase';
import { useRealtimeCollection, useRealtimeDoc } from './query';
import { useUser } from '../helpers/UserContext';
import { createActiveQuiz, endActiveQuiz } from './activeQuiz.api';
import * as firebase from 'firebase';

export const QuizStatuses = {
    idle: 'IDLE',
    waiting: 'WAITING',
    inProgress: 'IN_PROGRESS',
};

export const userRef = (id) => db.collection('users').doc(id);
export const quizCollectionRef = (userId) => userRef(userId).collection('quizzes');
export const quizRef = (userId, quizId) => quizCollectionRef(userId).doc(quizId);
export const questionCollectionRef = (userId, quizId) =>
    quizRef(userId, quizId).collection('questions');
export const questionRef = (userId, quizId, questionId) =>
    questionCollectionRef(userId, quizId).doc(questionId);

export const useQuiz = (quizId) => {
    const { user } = useUser();
    return useRealtimeDoc(quizRef(user.uid, quizId));
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
    text: '',
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

export const useUpdateQuiz = (quizId) => {
    const { user } = useUser();
    return (data) => updateQuiz(user.uid, quizId, data);
};

const updateQuiz = async (userId, quizId, data) => {
    await quizRef(userId, quizId).update(data);
};

export const useUpdateQuestionOrder = (quizId) => {
    const { user } = useUser();
    return async (questionOrder) => {
        await updateQuiz(user.uid, quizId, { questionOrder });
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
        const quiz = { title, status: QuizStatuses.idle, questionOrder: [] };
        const doc = await quizCollectionRef(user.uid).add(quiz);
        return { id: doc.uid, ...quiz };
    };
};

export const useDeleteQuiz = () => {
    const { user } = useUser();
    return async (quizId) => {
        return await quizRef(user.uid, quizId).delete();
    };
};

export const useStartQuiz = () => {
    const { user } = useUser();
    return async (quiz) => {
        const activeQuiz = await createActiveQuiz({
            owner: user.uid,
            quiz: quiz.id,
            title: quiz.title,
        });
        await quizRef(user.uid, quiz.id).update({
            activeQuiz: activeQuiz.id,
            status: QuizStatuses.waiting,
        });
    };
};

export const useStopQuiz = () => {
    const { user } = useUser();
    return async (quiz) => {
        await endActiveQuiz(quiz.activeQuiz);
        await quizRef(user.uid, quiz.id).update({
            status: QuizStatuses.idle,
            activeQuiz: '',
        });
    };
};

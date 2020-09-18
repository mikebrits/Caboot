import { db } from '../../config/firebase';

export const quizCollectionRef = () => db.collection('quizzes');
export const quizRef = (id) => quizCollectionRef().doc(id);
export const quizPlayersCollectionRef = (quizId) => quizRef(quizId).collection('players');

export async function getQuizzes() {
    const snapshot = await quizCollectionRef().get();
    return snapshot.docs.map((item) => item.data());
}

export const getQuiz = async (quizId) => {
    const doc = await quizRef(quizId).get();
    if (!doc.exists) {
        return undefined;
    }
    return doc.data();
};

export const getPlayersForQuiz = async (quizId) => {
    const snapshot = await quizPlayersCollectionRef(quizId).get();
    return snapshot.docs.map((item) => item.data());
};

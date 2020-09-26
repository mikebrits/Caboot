import { useRealtimeCollection, useRealtimeDoc } from './query';
import { useUser } from '../helpers/UserContext';
import { gameRef, createGame, endGame } from './game.api';
import { playersCollectionRef } from './players.api';
import { userRef } from './users.api';
import { questionCollectionRef } from './questions.api';

export const QuizStatuses = {
    idle: 'IDLE',
    waiting: 'WAITING',
    inProgress: 'IN_PROGRESS',
};

export const quizCollectionRef = (userId) => userRef(userId).collection('quizzes');
export const quizRef = (userId, quizId) => quizCollectionRef(userId).doc(quizId);

export const useQuiz = (quizId) => {
    const { user } = useUser();
    return useRealtimeDoc(quizRef(user.uid, quizId));
};

export const useAllQuizzes = () => {
    const { user } = useUser();
    return useRealtimeCollection(quizCollectionRef(user.uid));
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
        const game = await createGame({
            owner: user.uid,
            quiz: quiz.id,
            title: quiz.title,
        });
        await quizRef(user.uid, quiz.id).update({
            game: game.id,
            status: QuizStatuses.waiting,
        });
    };
};

export const useStopQuiz = () => {
    const { user } = useUser();
    return async (quiz) => {
        await endGame(quiz.game);
        await quizRef(user.uid, quiz.id).update({
            status: QuizStatuses.idle,
            game: '',
        });
    };
};

export const useManageQuiz = (quizId, gameId) => {
    const { user } = useUser();
    const [quiz, quizLoading, quizError] = useRealtimeDoc(quizRef(user.uid, quizId));
    const [game, gameLoading, gameError] = useRealtimeDoc(gameRef(gameId));
    const [players, playersLoading, playersError] = useRealtimeCollection(
        playersCollectionRef(gameId),
    );
    const [questions, questionsLoading, questionsError] = useRealtimeCollection(
        questionCollectionRef(user.uid, quizId),
    );

    return [
        { players, game, quiz, questions },
        playersLoading || gameLoading || quizLoading || questionsLoading,
        quizError || gameError || playersError || questionsError,
    ];
};

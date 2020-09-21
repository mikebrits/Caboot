import { getPlayersForQuiz } from '../../../../src/api/quizzes.api';

export default async (req, res) => {
    const result = await getPlayersForQuiz(req.query.id);
    res.statusCode = 200;
    res.json(result);
};

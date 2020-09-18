import { getQuiz } from '../../../../src/api/quizzes/quizzes.api';

export default async (req, res) => {
    const result = await getQuiz(req.query.id);
    if (result) {
        res.statusCode = 200;
        res.json(result);
    } else {
        res.statusCode = 404;
        res.send('Not found');
    }
};

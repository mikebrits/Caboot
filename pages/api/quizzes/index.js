import { db } from '../../../src/config/firebase';

export default async (req, res) => {
    const snapshot = await db.collection('quizzes').get();
    const data = snapshot.docs.map((item) => item.data());
    res.statusCode = 200;
    res.json(data);
};

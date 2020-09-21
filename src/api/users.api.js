import { db } from '../config/firebase';

const usersCollectionRef = () => db.collection('users');
const userRef = (id) => usersCollectionRef().doc(id);

export const isUserAuthorised = async (id) => {
    const user = await userRef(id).get();
    return user.exists;
};

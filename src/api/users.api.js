import { db } from '../config/firebase';

export const usersCollectionRef = () => db.collection('users');
export const userRef = (id) => usersCollectionRef().doc(id);

export const isUserAuthorised = async (id) => {
    const user = await userRef(id).get();
    return user.exists;
};

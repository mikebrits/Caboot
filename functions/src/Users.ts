import { auth } from 'firebase-functions';
import { db } from './db';

export const onCreateUser = auth.user().onCreate((user) => {
    return db.collection('users').doc(user.uid).set(
        {
            id: user.uid,
            name: user.displayName,
            active: true,
            email: user.email,
            profile_picture: user.photoURL,
            authorised: false,
            // added_at: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true },
    );
});

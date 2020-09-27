import _firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_APP_ID,
};

if (!_firebase.apps.length) {
    _firebase.initializeApp(firebaseConfig);
}

export const firebase = _firebase;
export const db = _firebase.firestore();
// if (process.env.NEXT_PUBLIC_ENV === 'dev') {
//     db.settings({
//         host: 'localhost:8080',
//         ssl: false,
//     });
// }
export const auth = _firebase.auth();

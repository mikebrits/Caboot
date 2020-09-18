import _firebase from 'firebase';
import 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAlwDdlg71sVcevDNYqQk-idDL79eR7z5s',
    authDomain: 'caboot.firebaseapp.com',
    databaseURL: 'https://caboot.firebaseio.com',
    projectId: 'caboot',
    storageBucket: 'caboot.appspot.com',
    messagingSenderId: '43442942490',
    appId: '1:43442942490:web:87406a652608494eff17a3',
};

if (!_firebase.apps.length) {
    _firebase.initializeApp(firebaseConfig);
}

export const firebase = _firebase;

export const db = _firebase.firestore();
export const auth = _firebase.auth();

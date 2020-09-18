import firebase from "firebase";
import "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAlwDdlg71sVcevDNYqQk-idDL79eR7z5s",
    authDomain: "caboot.firebaseapp.com",
    databaseURL: "https://caboot.firebaseio.com",
    projectId: "caboot",
    storageBucket: "caboot.appspot.com",
    messagingSenderId: "43442942490",
    appId: "1:43442942490:web:87406a652608494eff17a3"
};

if (!firebase.apps.length) {
    firebase.initializeApp({});
}

export const db = firebase.firestore();


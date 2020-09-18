import { region } from 'firebase-functions';
const admin = require('firebase-admin');

admin.initializeApp();
export const db = admin.firestore();

export const firestore = region('europe-west2').firestore;
export const auth = region('europe-west2').auth;
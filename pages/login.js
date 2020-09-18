import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React from 'react';
import * as firebase from 'firebase';
import { auth } from '../src/config/firebase';
import { useUser } from '../helpers/UserContext';
import { Button } from 'grommet';

const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

export default function Login() {
    const { user } = useUser();
    if (user) {
        return (
            <>
                <p>You are already signed in!</p>
                <Button primary label="Sign Out" onClick={() => auth.signOut()} />
            </>
        );
    }
    return (
        <div>
            <h1>My App</h1>
            <p>Please sign-in:</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
    );
}

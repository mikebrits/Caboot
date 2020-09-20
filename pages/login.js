import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React from 'react';
import * as firebase from 'firebase';
import { auth } from '../src/config/firebase';
import { useUser } from '../src/helpers/UserContext';
import { Page } from '../src/components/Page';
import { CardContent } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';

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
            <Page>
                <Button variant="contained" onClick={() => auth.signOut()}>
                    Sign Out
                </Button>
            </Page>
        );
    }
    return (
        <Page>
            <Card variant="outlined">
                <CardContent>
                    <h2>Please sign-in:</h2>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </CardContent>
            </Card>
        </Page>
    );
}

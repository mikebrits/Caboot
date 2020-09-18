import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import React from 'react';
import * as firebase from 'firebase';
import { auth } from '../src/config/firebase';
import { useUser } from '../src/helpers/UserContext';
import { Box, Button, Card } from 'grommet';
import { Page } from '../src/components/Page';

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
                <p>You are already signed in!</p>
                <Button primary label="Sign Out" onClick={() => auth.signOut()} />
            </Page>
        );
    }
    return (
        <Page>
            <Box pad="medium" align="center">
                <Card
                    height="small"
                    width="medium"
                    background="light-1"
                    pad="medium"
                    align={'center'}
                >
                    <h2>Please sign-in:</h2>
                    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
                </Card>
            </Box>
        </Page>
    );
}

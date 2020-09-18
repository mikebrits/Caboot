import React from 'react';
import { useUser } from './UserContext';
import { Button } from 'grommet';
import Link from 'next/link';

export const requiresAuth = (Page) => ({ ...props }) => {
    const { user } = useUser();
    if (user) return <Page {...props} user={user} />;
    return (
        <>
            <h1>This page is for signed in users only</h1>
            <Link href={'/login'}>
                <Button primary label="Go to Sign In" />
            </Link>
        </>
    );
};

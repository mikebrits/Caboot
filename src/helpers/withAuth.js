import React from 'react';
import { useUser } from './UserContext';
import Link from 'next/link';

export const requiresAuth = (Content) => ({ ...props }) => {
    const { user } = useUser();
    if (user) return <Content {...props} user={user} />;
    return (
        <>
            <h1>This page is for signed in users only</h1>
            <Link href={'/login'}>Go to Sign In</Link>
        </>
    );
};

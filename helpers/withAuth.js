import React from 'react';
import { useUser } from './UserContext';

export const requiresAuth = (Page) => ({ ...props }) => {
    const { user } = useUser();
    if (user) return <Page {...props} user={user} />;
    return <h1>Please Login</h1>;
};

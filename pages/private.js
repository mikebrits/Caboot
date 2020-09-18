import React from 'react';
import { requiresAuth } from '../src/helpers/withAuth';

const Private = ({ user }) => {
    return (
        <>
            <h1>Private</h1>
            <p>Welcome {user.displayName}</p>
        </>
    );
};

export default requiresAuth(Private);

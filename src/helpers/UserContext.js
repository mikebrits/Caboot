import React, { useContext, createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { isUserAuthorised } from '../api/users.api';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                isUserAuthorised(user.uid).then((exists) => {
                    if (exists) {
                        setUser(user);
                    }
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });
    }, []);
    if (loading) return <>Loading...</>;
    return (
        <UserContext.Provider value={{ user, signOut: auth.signOut }}>
            {children}
        </UserContext.Provider>
    );
};

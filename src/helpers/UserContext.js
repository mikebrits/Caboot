import React, { useContext, createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged(function (user) {
            if (user) {
                setLoading(false);
            } else {
                setLoading(false);
            }
            setUser(user);
        });
    }, []);
    if (loading) return <>Loading...</>;
    return (
        <UserContext.Provider value={{ user, signOut: auth.signOut }}>
            {children}
        </UserContext.Provider>
    );
};

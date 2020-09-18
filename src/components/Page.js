import React from 'react';
import { Header, Menu } from 'grommet';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../helpers/UserContext';

export const Page = ({ children }) => {
    const router = useRouter();
    const { user } = useUser();
    const handleAccountClick = () => {
        router.push('/login');
    };
    return (
        <>
            <Header background="brand">
                <Link href="/">Caboot</Link>
                <Menu
                    label="account"
                    items={[{ label: user ? 'Sign Out' : 'Sign In', onClick: handleAccountClick }]}
                />
            </Header>
            {children}
        </>
    );
};

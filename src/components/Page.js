import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser } from '../helpers/UserContext';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { FaUserCircle } from 'react-icons/fa';

export const Page = ({ children }) => {
    const router = useRouter();
    const { user } = useUser();
    const handleAccountClick = () => {
        router.push('/login');
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Link href={'/'}>
                        <Typography variant="h6">Caboot</Typography>
                    </Link>
                    {user && <Link href={'/quizzes'}>Quizzes</Link>}

                    <IconButton onClick={handleAccountClick}>
                        <FaUserCircle />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <main style={{ padding: 16 }}>{children}</main>
        </>
    );
};

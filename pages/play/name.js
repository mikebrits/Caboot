import React, { useState } from 'react';
import { Page } from '../../src/components/Page';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';
import { joinGame } from '../../src/api/activeQuiz.api';
import { toast } from 'react-toastify';
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';
import { BsArrowClockwise, BsPlay } from 'react-icons/bs';

const getName = () => {
    return uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        style: 'capital',
        separator: '',
    });
};

const Name = ({ pin }) => {
    const router = useRouter();
    const [name, setName] = useState(getName());
    const handleSubmit = async () => {
        try {
            await joinGame(pin, name);
            toast.success('Joined Game!');
            await router.push(`/play/${pin.trim()}`);
        } catch (e) {
            toast.error(`Could not join game: ${e}`);
            console.error(e);
        }
    };
    if (!pin) {
        router.push('/');
    }
    return (
        <Page>
            <h1>Please Select a Name</h1>
            <h2>{name}</h2>
            <Button
                startIcon={<BsArrowClockwise />}
                variant="outlined"
                color="primary"
                onClick={() => setName(getName())}
            >
                Get New Name
            </Button>
            &nbsp; &nbsp;
            <Button
                startIcon={<BsPlay />}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
            >
                Play Game!
            </Button>
        </Page>
    );
};

export async function getServerSideProps(context) {
    return {
        props: {
            pin: context.query.pin,
        },
    };
}

export default Name;

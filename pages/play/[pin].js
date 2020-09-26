import React from 'react';
import Play from '../../src/components/pages/Play';

const PlayPage = ({ pin }) => {
    return <Play pin={pin} />;
};

export default PlayPage;

export async function getServerSideProps(context) {
    return {
        props: {
            pin: context.params.pin,
        },
    };
}

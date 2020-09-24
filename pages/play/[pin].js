import React, { useEffect, useState } from 'react';
import { Page } from '../../src/components/Page';
import { answerQuestion, useActiveQuizByPin } from '../../src/api/activeQuiz.api';
import Spinner from '../../src/components/Spinner';
import { getPlayerForLocalGame } from '../../src/api/localGameState';
import { useRouter } from 'next/router';
import Play from '../../src/components/pages/Play/Play';

export default ({ pin }) => {
    return <Play pin={pin} />;
};

export async function getServerSideProps(context) {
    return {
        props: {
            pin: context.params.pin,
        },
    };
}

import React from 'react';
import { Page } from '../Page';

const Error = ({ title, text }) => {
    return (
        <Page>
            <h1>{title}</h1>
            <p>{text}</p>
        </Page>
    );
};

export default Error;

import React from 'react';

const Error = ({ title, text }) => {
    return (
        <>
            <h1>{title}</h1>
            <p>{text}</p>
        </>
    );
};

export default Error;

import React, { useRef } from 'react';
import { url } from '../../../config/defaults';
import { toast } from 'react-toastify';

const GameLink = ({ pin }) => {
    const ref = useRef();
    const link = `${url}/play/${pin}`;
    const copy = () => {
        console.log({ ref });
        ref.current.select();
        ref.current.setSelectionRange(0, 99999);
        document.execCommand('copy');
        toast.success('Link copied to clipboard!');
    };
    return (
        <input
            style={{ cursor: 'pointer', width: 300 }}
            value={link}
            ref={ref}
            onClick={copy}
            readOnly
        />
    );
};

export default GameLink;

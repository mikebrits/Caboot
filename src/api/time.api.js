import { url } from '../config/defaults';

export const getTime = async () => {
    const res = await fetch(`${url}/api/time`);
    return await res.json();
};

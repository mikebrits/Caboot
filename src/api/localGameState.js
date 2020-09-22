const KEY = 'caboot';

const validate = () => {
    if (!localStorage.getItem(KEY)) {
        throw new Error('Caboot not initialised in local storage');
    }
};

const get = (key) => {
    validate();
    const caboot = JSON.parse(localStorage.getItem(KEY));
    return caboot[key];
};

const getStore = () => {
    return JSON.parse(localStorage.getItem(KEY));
};

const set = (key, value) => {
    validate();
    const data = { ...getStore(), [key]: value };
    localStorage.setItem(KEY, JSON.stringify(data));
};

export const initLocalStorage = () => {
    if (!localStorage.getItem(KEY)) {
        localStorage.setItem(KEY, '{}');
    }
};

export const getPlayerForLocalGame = (id) => {
    return get(id);
};

export const setLocalGame = (id, player) => {
    set(id, player);
};

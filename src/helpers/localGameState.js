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

export const getPlayerForLocalGame = (gameId) => {
    return get(gameId);
};

export const setLocalGame = (gameId, player) => {
    set(gameId, player);
};

export const updateLocalPlayer = (gameId, data) => {
    const player = get(gameId);
    set(gameId, {...player, ...data});
};

export const addAnswerToLocalPlayer = (gameId, questionId, answer) => {
    const player = get(gameId);
    set(gameId, {...player, answers: [...player.answers, {questionId, answer}]})
}

export const hasPlayerAnsweredQuestion = (gameId, questionId) => {
    const player = get(gameId);
    return !!player.answers.find(item => item.questionId === questionId);
}

export const setLocalQuestionTimer = (gameId, time) => {
    updateLocalPlayer(gameId, {questionTimer: time})
}

export const getLocalQuestionTimer = (gameId) => {
    const player = get(gameId);
    return player.questionTimer;
}



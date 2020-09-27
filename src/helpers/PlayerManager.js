export const playerHasAnsweredQuestion = (playerId, questionId) => {
    const player = players.find((i) => i.id === playerId);
    return !!player.answers.find((i) => i.questionId === questionId);
};
export const playerHasAnsweredCurrentQuestion = (playerId) => {
    return !!playerHasAnsweredQuestion(playerId, game.currentQuestionId);
};

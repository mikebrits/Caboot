import {activeQuizStatuses} from "../../../../api/activeQuiz.api";
import {INIT} from "./Play.constants";

export const defaultState = {
    status: activeQuizStatuses.waiting,
    answers: [],
    offset: 0,
    startTime: 0,
    questionAnswered: false,
    game: null,
    player: null
}



export default (state = defaultState, {type, payload}) => {
    switch (type){
        case INIT:
            return {
                ...state,
                game: payload.game,
                player: payload.player
            }
        default:
            return state;
    }
}
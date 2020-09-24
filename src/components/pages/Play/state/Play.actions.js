import {INIT, ANSWER_QUESTION} from "./Play.constants";


export const init = ({game, player}) => ({type: INIT, payload: {game, player}});
export const answerQuestion = () => ({
    type: ANSWER_QUESTION,
    payload: {
        
    }
});

import {FETCH_LOT, FETCH_LOTS} from "./types";

const initialState = {
    lots : []
}

export const lotsReducer = (state = initialState, action) => {
    switch (action.type){
        case FETCH_LOTS:
            return {...state, lots: action.payload}
        case FETCH_LOT:
            return {...state, lots : state.lots.concat(action.payload)}
        default:
            return state;
    }
}
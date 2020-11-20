import {UPDATE_LOT, FETCH_LOT, FETCH_LOTS, UPDATE_LOT_PRICE} from "./types";

const initialState = {
    lots : []
}

export const lotsReducer = (state = initialState, action) => {
    switch (action.type){
        case FETCH_LOTS:
            return {...state, lots: action.payload};
        case FETCH_LOT:
            return {...state, lots : state.lots.concat(action.payload)};
        case UPDATE_LOT:
            return {...state, lots : state.lots.map(lot=> {
                if(lot.id === action.payload.id){
                    return action.payload;
                }
                return lot;
            })};
        case UPDATE_LOT_PRICE:
            return {...state, lots: state.lots.map(lot => {
                if(lot.id === action.payload.id){
                    return {...lot, priceUsd: action.payload.price}
                }
                return lot;
                })}
        default:
            return state;
    }
}
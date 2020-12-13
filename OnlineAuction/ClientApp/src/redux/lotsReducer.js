import {UPDATE_LOT, FETCH_LOT, FETCH_LOTS, UPDATE_LOT_PRICE, DELETE_LOT, UPDATE_LOT_ACTIVITY, CLOSE_LOT} from "./types";

const initialState = {
    lots : [],
    activePage : 1,
    totalPages : 0
}

export const lotsReducer = (state = initialState, action) => {
    switch (action.type){
        case FETCH_LOTS:
            return {...state, lots: action.payload.lots, totalPages: action.payload.pagesCount, activePage: action.payload.activePage};
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
        case UPDATE_LOT_ACTIVITY:
            return {...state, lots: state.lots.map(lot => {
                    if(lot.id === action.payload.id){
                        return {...lot, isActive: action.payload.isActive}
                    }
                    return lot;
                })}
        case CLOSE_LOT:
            return {...state, lots: state.lots.map(lot => {
                    if(lot.id === action.payload.id){
                        return {...lot, isActive: false, isSold: true}
                    }
                    return lot;
                })}
        case DELETE_LOT:
            return {...state, lots: state.lots.filter(lot => lot.id !== action.payload.id)}
        default:
            return state;
    }
}
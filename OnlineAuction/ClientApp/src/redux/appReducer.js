import {
    HIDE_LOT_LOADER, HIDE_USER_LOADER,
    HIDE_WINNERS_LOADER,
    SHOW_LOT_LOADER, SHOW_USER_LOADER,
    SHOW_WINNERS_LOADER
} from "./types";

const initialState = {
    lotLoading: false,
    winnersLoading: false,
    userLoading : false,
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOT_LOADER:
            return {...state, lotLoading: true}
        case HIDE_LOT_LOADER:
            return {...state, lotLoading: false}
        case SHOW_WINNERS_LOADER:
            return {...state, winnersLoading: true}
        case HIDE_WINNERS_LOADER:
            return {...state, winnersLoading: false}
        case SHOW_USER_LOADER:
            return {...state, userLoading: true}
        case HIDE_USER_LOADER:
            return {...state, userLoading: false}
        default:
            return state;
    }
}
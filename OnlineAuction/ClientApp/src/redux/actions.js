import {FETCH_LOTS} from "./types";

export function fetchLots(){
    return async dispatch => {
        const response = await fetch('api/lots');
        const json = await response.json();
        dispatch({type : FETCH_LOTS, payload: json})
    }
}
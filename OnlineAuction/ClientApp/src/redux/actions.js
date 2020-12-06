import {
    CLOSE_LOT,
    DELETE_LOT,
    FETCH_LOT,
    FETCH_LOTS,
    HIDE_LOT_LOADER, HIDE_WINNERS_LOADER,
    SHOW_LOT_LOADER, SHOW_WINNERS_LOADER,
    UPDATE_LOT,
    UPDATE_LOT_ACTIVITY,
    UPDATE_LOT_PRICE
} from "./types";
import {lotControllerPath} from "../components/LotConstants";
import authService from "../components/api-authorization/AuthorizeService";

export function fetchLots(){
    return async dispatch => {
        dispatch(showLoader());
        const response = await fetch(lotControllerPath);
        const json = await response.json();
        dispatch({type : FETCH_LOTS, payload: json})
        dispatch(hideLoader());
    }
}

export function fetchLot(id){
    return async dispatch => {
        dispatch(showLoader());
        const response = await fetch(`${lotControllerPath}/${id}`);
        const json = await response.json();
        dispatch({type : FETCH_LOT, payload: json})
        dispatch(hideLoader());
    }
}

export function updateLot(lot){
    return dispatch => {
        dispatch({type : UPDATE_LOT, payload: lot})
    }
}


export function updateLotPrice(id, price){
    return dispatch => {
        dispatch({type : UPDATE_LOT_PRICE, payload: {id, price}})
    }
}

export function updateLotActivity(id, isActive){
    return dispatch => {
        dispatch({type : UPDATE_LOT_ACTIVITY, payload: {id, isActive}})
    }
}

export function closeLot(id){
    return dispatch => {
        dispatch({type : CLOSE_LOT, payload: {id}})
    }
}

export function deleteLotAction(id){
    return async dispatch => {
        const token = await authService.getAccessToken();
        const response = await fetch(`${lotControllerPath}/${id}`, {
            method : "DELETE",
            headers: !token ? {} : {
                'Authorization': `Bearer ${token}`,
            },
        })

        if(response.ok){
            dispatch({type : DELETE_LOT, payload: {id}})
        }
        else{
            throw new Error(await response.text());
        }
    }
}

export function showLoader() {
    return {
        type: SHOW_LOT_LOADER
    }
}

export function hideLoader() {
    return {
        type: HIDE_LOT_LOADER
    }
}

export function showWinnersLoader() {
    return {
        type: SHOW_WINNERS_LOADER
    }
}

export function hideWinnersLoader() {
    return {
        type: HIDE_WINNERS_LOADER
    }
}
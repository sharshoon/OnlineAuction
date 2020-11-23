import {DELETE_LOT, FETCH_LOT, FETCH_LOTS, UPDATE_LOT, UPDATE_LOT_PRICE} from "./types";
import {lotControllerPath} from "../components/LotConstants";
import authService from "../components/api-authorization/AuthorizeService";

export function fetchLots(){
    return async dispatch => {
        const response = await fetch(lotControllerPath);
        const json = await response.json();
        dispatch({type : FETCH_LOTS, payload: json})
    }
}

export function fetchLot(id){
    return async dispatch => {
        const response = await fetch(`${lotControllerPath}/${id}`);
        const json = await response.json();
        dispatch({type : FETCH_LOT, payload: json})
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

export function deleteLot(id){
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
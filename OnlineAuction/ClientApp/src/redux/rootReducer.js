import {combineReducers} from "redux";
import {lotsReducer} from "./lotsReducer";

export const rootReducer = combineReducers({
    lotsInfo : lotsReducer
})
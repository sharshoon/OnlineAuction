import {combineReducers} from "redux";
import {lotsReducer} from "./lotsReducer";
import {appReducer} from "./appReducer";

export const rootReducer = combineReducers({
    lotsInfo : lotsReducer,
    app: appReducer
})
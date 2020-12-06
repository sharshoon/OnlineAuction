import * as signalR from "@microsoft/signalr";
import {activateLotCommand, activateLotMessage, lotHubPath} from "../LotConstants";
import {updateLot} from "../../redux/actions";

export const openHubConnection = function(dispatch, lot){
    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(lotHubPath)
        .build();

    hubConnection.on(activateLotCommand, function (message, id) {
        if(lot.id === parseInt(id)){
            dispatch(updateLot({...lot, isActive: message === activateLotMessage}));
        }
    });
    hubConnection.start();

    return hubConnection;
}
import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames"
import {
    activateLotCommand,
    activateLotMessage,
    decreaseTimeCommand,
    lotHubPath,
    stopCommand
} from "../LotConstants";
import {closeLot, updateLot, updateLotActivity} from "../../redux/actions";
import {useDispatch} from "react-redux";
import * as signalR from "@microsoft/signalr";

const minuteSeconds = 60;
const hourSeconds = 3600;

const renderTime = (dimension, time, timerItemClasses) => {
    return (
        <div className={timerItemClasses}>
            <div className="timer__time">{time}</div>
            <div>{dimension}</div>
        </div>
    );
};

const getTimeMinutes = time => ((time - time % minuteSeconds) / minuteSeconds) | 0;
const getTimeHours = time => (time / hourSeconds) | 0;
const timerClasses = classNames("main__timer","timer");

const openHubConnection = function(dispatch, lot){
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

export default function Timer({lot}) {
    const [remainSeconds, setSeconds] = useState(0);
    const hubConnection = useRef(null);
    const isMountedRef = useRef(null);
    const isActive = useRef(false);
    const dispatch = useDispatch();
    const timerItemClasses = classNames("timer__item", {"timer__item--translucent" : !lot.isActive});
    let lotMessage;

    useEffect(() => {
        isMountedRef.current = true;
        if(lot && !hubConnection.current) {
            hubConnection.current = openHubConnection(dispatch, lot);

            hubConnection.current.on(decreaseTimeCommand, function (seconds) {
                if(isMountedRef.current){
                    if(!isActive.current){
                        isActive.current = true;
                        dispatch(updateLotActivity(lot.id, true));
                    }
                    setSeconds(seconds);
                }
            });

            hubConnection.current.on(stopCommand, function(){
                dispatch(closeLot(lot.id));
            });
        }

        return () => isMountedRef.current = false;
    }, [lot, hubConnection]);

    if(lot.isSold){
        lotMessage = <div className='timer__not-active'>This lot is sold!</div>
    }
    else if(!lot.isActive){
        lotMessage = <div className='timer__not-active'>This lot is not active!</div>
    }
    return (
        <div className='main__timer-wrapper'>
            {lotMessage}
            <div className={timerClasses}>
                {renderTime("hours", getTimeHours(remainSeconds), timerItemClasses)}
                {renderTime("minutes", getTimeMinutes(remainSeconds), timerItemClasses)}
                {renderTime("seconds", remainSeconds % minuteSeconds | 0, timerItemClasses)}
            </div>
        </div>
    );
}

import React, {useEffect, useMemo, useRef, useState} from "react";
import classNames from "classnames"
import {
    activateLotCommand,
    activateLotMessage,
    decreaseTimeCommand,
    lotHubPath,
    startLotMethod
} from "../Lot/LotConstants";
import {updateLot} from "../../redux/actions";
import {useDispatch, useSelector} from "react-redux";
import * as signalR from "@microsoft/signalr";

const minuteSeconds = 60;
const hourSeconds = 3600;
const daySeconds = 86400;

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
    console.log("active lot");
    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(lotHubPath)
        .build();

    hubConnection.start().then(() => {
        hubConnection.invoke(startLotMethod, "active", 1);
    }).catch(function (e) {
        alert(e.message);
    });

    hubConnection.on(activateLotCommand, function (message, id) {
        if(lot.id === parseInt(id)){
            console.log(message, activateLotMessage, message === activateLotMessage);
            dispatch(updateLot({...lot, isActive: message === activateLotMessage}));
        }
    });

    return hubConnection;
}

export default function Timer({id, lot}) {
    const [remainSeconds, setSeconds] = useState(0);
    const hubConnection = useRef(null);
    const dispatch = useDispatch();
    const timerItemClasses = classNames("timer__item", {"timer__item--translucent" : !lot.isActive});
    let lotMessage;

    useEffect(() => {
        if(lot && !hubConnection.current) {
            hubConnection.current = openHubConnection(dispatch, lot);

            hubConnection.current.on(decreaseTimeCommand, function (seconds) {
                setSeconds(seconds);
            });
        }
    }, [lot, hubConnection]);


    if(!lot.isActive){
        lotMessage = <div className='timer__not-started'>Auction has not started yet!</div>
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

import React, {useEffect, useRef, useState} from "react";
import classNames from "classnames"
import {
    decreaseTimeCommand,
    stopCommand
} from "../LotConstants";
import {closeLot, updateLotActivity, updateLotPrice} from "../../redux/actions";
import {useDispatch} from "react-redux";
import {getTimeHours, getTimeMinutes, minuteSeconds, renderTime} from "./getTime";
import {openHubConnection} from "./openHubConnection";

export default function Timer({lot}) {
    const [remainSeconds, setSeconds] = useState(0);
    const hubConnection = useRef(null);
    const isMountedRef = useRef(null);
    const isActive = useRef(false);
    const dispatch = useDispatch();
    const timerItemClasses = classNames("timer__item", {"timer__item--translucent" : !lot.isActive});
    const timerClasses = classNames("main__timer","timer");
    let lotMessage;

    useEffect(() => {
        isMountedRef.current = true;
        if(lot && !hubConnection.current) {
            hubConnection.current = openHubConnection(dispatch, lot);

            hubConnection.current.on(decreaseTimeCommand, function (seconds, price, id) {
                if(isMountedRef.current && id === lot.id){
                    if(!isActive.current){
                        isActive.current = true;
                        dispatch(updateLotActivity(lot.id, true));
                    }
                    setSeconds(seconds);

                    if(lot.priceUsd !== price){
                        dispatch(updateLotPrice(lot.id, price));
                    }
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

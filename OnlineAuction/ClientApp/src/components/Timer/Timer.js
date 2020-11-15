import React, {useEffect} from "react";
import classNames from "classnames"

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

const getTimeSeconds = time => (minuteSeconds - time) | 0;
const getTimeMinutes = time => ((time*1000 % hourSeconds) / minuteSeconds) | 0;
const getTimeHours = time => (time / hourSeconds) | 0;
const timerClasses = classNames("main__timer","timer");

export default function Timer({lot}) {
    const startTime = Date.now() / 1000;
    const endTime = startTime + 243248;

    const remainingTime = endTime - startTime;
    const days = Math.ceil(remainingTime / daySeconds);

    let lotMessage;
    let timerItemClasses;

    timerItemClasses = classNames("timer__item", {"timer__item--translucent" : !lot.isActive});
    if(!lot.isActive){
        lotMessage = <div className='timer__not-started'>Auction has not started yet!</div>
    }
    return (
        <div className='main__timer-wrapper'>
            {lotMessage}
            <div className={timerClasses}>
                {renderTime("hours", getTimeHours(daySeconds*days / 1000), timerItemClasses)}
                {renderTime("minutes", getTimeMinutes(hourSeconds / 1000), timerItemClasses)}
                {renderTime("seconds", getTimeSeconds(remainingTime % minuteSeconds), timerItemClasses)}
            </div>
        </div>
    );
}

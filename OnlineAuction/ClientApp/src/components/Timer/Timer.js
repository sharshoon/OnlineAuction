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

const getTimeMinutes = time => ((time - time % minuteSeconds) / minuteSeconds) | 0;
const getTimeHours = time => (time / hourSeconds) | 0;
const timerClasses = classNames("main__timer","timer");

export default function Timer({lot, seconds}) {
    const remainingTime = seconds;
    const days = Math.ceil(remainingTime / daySeconds);

    const timerItemClasses = classNames("timer__item", {"timer__item--translucent" : !lot.isActive});
    let lotMessage;
    if(!lot.isActive){
        lotMessage = <div className='timer__not-started'>Auction has not started yet!</div>
    }
    return (
        <div className='main__timer-wrapper'>
            {lotMessage}
            <div className={timerClasses}>
                {renderTime("hours", getTimeHours(remainingTime), timerItemClasses)}
                {renderTime("minutes", getTimeMinutes(remainingTime), timerItemClasses)}
                {renderTime("seconds", remainingTime % minuteSeconds | 0, timerItemClasses)}
            </div>
        </div>
    );
}

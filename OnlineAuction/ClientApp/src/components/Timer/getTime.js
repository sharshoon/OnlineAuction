export const minuteSeconds = 60;
export const hourSeconds = 3600;

export const renderTime = (dimension, time, timerItemClasses) => {
    return (
        <div className={timerItemClasses}>
            <div className="timer__time">{time}</div>
            <div>{dimension}</div>
        </div>
    );
};

export const getTimeMinutes = time => ((time % hourSeconds) / minuteSeconds) | 0;
export const getTimeHours = time => (time / hourSeconds) | 0;
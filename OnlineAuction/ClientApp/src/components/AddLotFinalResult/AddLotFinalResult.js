import React, {useMemo} from "react";
import classNames from "classnames";

export default function AddLotFinalResult({successed, message}){
    const classes = useMemo(() => {
        return classNames("add-lot__final-result", {"add-lot__final-result--error" : !successed})
    });

    if(message) {
        return (
            <p className={classes}>{message}</p>
        )
    }
    else{
        return '';
    }
}
import React, {useMemo} from "react";
import classNames from "classnames";

export default function ResultTextBlock({successed, message}){
    const classes = useMemo(() => {
        return classNames("result-block", {"result-block--error" : !successed})
    }, []);

    if(message) {
        return (
            <p className={classes}>{message}</p>
        )
    }
    else{
        return '';
    }
}
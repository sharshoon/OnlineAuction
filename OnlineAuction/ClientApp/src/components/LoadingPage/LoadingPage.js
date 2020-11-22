import React from 'react'
import Loader from "../Loader/Loader";
import classNames from "classnames";

export default function LoadingPage(){
    const classes = classNames("main", "main__loading-page", "loading-page", "container-border");
    return(
        <div className={classes}>
            <Loader/>
        </div>
    )
}
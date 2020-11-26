import React, {useMemo} from "react"
import classNames from "classnames"

export default function CustomMessagePage({message}){
    const pageClasses = useMemo(() => {
        return classNames("main", "main__custom-message-page","container-border");
    }, [])

    return(
        <div className={pageClasses}>
            {message}
        </div>
    )
}
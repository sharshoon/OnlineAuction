import React, {useEffect} from 'react'
import LotPreview from "../LotPreview/LotPreview";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../../redux/actions";
import classNames from "classnames"
import LoadingPage from "../LoadingPage/LoadingPage";
import Pagination from "../Pagination/Pagination";
import Switcher from "../Switcher/Switcher";

export default function Lots(){
    const dispatch = useDispatch();
    const lotsInfo = useSelector(state => state.lotsInfo);
    const loading = useSelector(state => state.app.lotLoading);
    const lotsWrapperClasses = classNames("main", "main__lot-preview-wrapper", "container-border");
    useEffect(() => {
        dispatch(fetchLots(1, lotsInfo.onlyUnsold));
    },[dispatch]);

    if(loading){
        return <LoadingPage/>
    }
    if(!lotsInfo.lots){
        return (
            <div className={lotsWrapperClasses}>
                <Switcher/>
                <div className="main__custom-message-page">Error</div>
            </div>
        )
    }
    if(lotsInfo.lots && !lotsInfo.lots.length){
        return (
            <div className={lotsWrapperClasses}>
                <Switcher/>
                <div className="main__custom-message-page">There are no lots on the server</div>
            </div>)
    }
    return (
        <div className={lotsWrapperClasses}>
            <Switcher/>
            {lotsInfo.lots.map(lot => <LotPreview lot={lot} key={lot.id}/>)}
            <div className="main__pagination">
                <Pagination pageCount={lotsInfo.totalPages}/>
            </div>
        </div>
    )
}
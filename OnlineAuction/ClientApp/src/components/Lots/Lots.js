import React, {useEffect} from 'react'
import LotPreview from "../LotPreview/LotPreview";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../../redux/actions";
import classNames from "classnames"
import LoadingPage from "../LoadingPage/LoadingPage";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";

export default function Lots(){
    const dispatch = useDispatch();
    const lots = useSelector(state => state.lotsInfo.lots);
    const lotsWrapperClasses = classNames("main", "main__lot-preview-wrapper", "container-border");
    const loading = useSelector(state => state.app.lotLoading);
    useEffect(() => {
        dispatch(fetchLots());
    },[dispatch])

    if(loading){
        return <LoadingPage/>
    }
    if(!lots.length){
        return <CustomMessagePage message={"There are no lots on the server"}/>
    }
    return (
        <div className={lotsWrapperClasses}>
            {lots.map(lot => <LotPreview lot={lot} key={lot.id}/>)}
        </div>
    )
}
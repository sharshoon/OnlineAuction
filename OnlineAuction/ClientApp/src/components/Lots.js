import React, {useEffect} from 'react'
import LotPreview from "./LotPreview/LotPreview";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../redux/actions";
import classNames from "classnames"

export default function Lots(){
    const dispatch = useDispatch();
    const lots = useSelector(state => state.lotsInfo.lots);
    const lotsWrapperClasses = classNames("main", "main__lot-preview-wrapper", "container__border");
    useEffect(() => {
        dispatch(fetchLots());
    },[])

    if(!lots.length){
        return "Загрузка постов!"
    }
    return (
        <div className={lotsWrapperClasses}>
            {lots.map(lot => <LotPreview lot={lot} key={lot.id}/>)}
        </div>
    )
}
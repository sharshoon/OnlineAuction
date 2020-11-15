import React, {useEffect} from 'react'
import LotPreview from "./LotPreview";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../redux/actions";

export default function Lots(){
    const dispatch = useDispatch();
    const lots = useSelector(state => state.lotsInfo.lots);

    useEffect(() => {
        dispatch(fetchLots());
    },[])

    if(!lots.length){
        return "Загрузка постов!"
    }
    return lots.map(lot => <LotPreview lot={lot} key={lot.id}/>)
}
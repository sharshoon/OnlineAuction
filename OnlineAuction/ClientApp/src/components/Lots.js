import React, {useEffect} from 'react'
import Lot from "./Lot";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../redux/actions";

export default function Lots(){
    const dispatch = useDispatch();
    const lots = useSelector(state => state.lotsInfo.lots);

    useEffect(() => {
        dispatch(fetchLots());
    },[])

    if(!lots){
        return "Загрузка постов!"
    }
    return lots.map(lot => <Lot lot={lot} key={lot.id}/>)
}
import React, {useEffect, useMemo, useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {fetchLot, updateLot} from "../../redux/actions";
import classNames from 'classnames'
import Timer from "../Timer/Timer";
import IncreaseRateButtons from "../IncreaseRateButtons/IncreaseRateButtons";

const titleClasses = classNames("main__title","title");
const lotInfoClasses = classNames("main__lot-info", "lot-info", "info");

export default function Lot({id}){
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));

    useEffect(() => {
        if(!lot){
            dispatch(fetchLot(id));
        }
    }, []);

    if(!lot){
        return "Post loading";
    }

    return (
        <div className='main container__border'>
            <img className='main__image' src={lot.imagePath}/>
            <div className='main__lot-info-wrapper'>
                <div className={titleClasses}>{lot.name}</div>
                <div className={lotInfoClasses}>
                    <div className='lot-info__item'><span className="lot-info__name">Description: </span><span>{lot.description}</span></div>
                    <div className='lot-info__item'><span className="lot-info__name">Price: </span><span>{lot.priceUsd || lot.minPriceUsd} USD</span></div>
                    <Timer id={id} lot={lot}/>
                    <IncreaseRateButtons id={id}/>
                </div>
            </div>
        </div>
    )
}
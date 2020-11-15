import React, {useEffect} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {fetchLot} from "../../redux/actions";
import classNames from 'classnames'
import Timer from "../Timer/Timer";

export default function Lot(props){
    const id = props.match.params.id;
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));
    const titleClasses = classNames("main__title","title");
    const lotInfoClasses = classNames("main__lot-info", "lot-info")
    useEffect(() => {

        if(!lot){
            dispatch(fetchLot(id));
        }
    }, [])

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
                    <Timer lot={lot}/>
                    <div className='lot-info__buttons'>
                        <button className='lot-info__button'>+5%</button>
                        <button className='lot-info__button'>+10%</button>
                        <button className='lot-info__button'>+20%</button>
                    </div>
                </div>
            </div>
        </div>
        )
}
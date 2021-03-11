import React, {useEffect, useMemo} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {fetchLot} from "../../redux/actions";
import classNames from 'classnames'
import Timer from "../Timer/Timer";
import IncreaseRateButtons from "../IncreaseRateButtons/IncreaseRateButtons";
import LoadingPage from "../LoadingPage/LoadingPage";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";
import {lotClasses} from "./classes";

export default function Lot({id}){
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));
    const loading = useSelector(state => state.app.lotLoading);

    useEffect(() => {
        if(!lot){
            dispatch(fetchLot(id));
        }
    }, []);

    const classes = useMemo(() => {
        return {
            titleClasses : classNames("main__title","title"),
            lotInfoClasses : classNames("main__lot-info", "lot-info", "info")
        }
    }, [])

    if(loading){
        return <LoadingPage/>
    }
    if(!lot){
        return <CustomMessagePage message={"There is no such lot on the server"}/>
    }

    return (
        <div className='main container-border'>
            <div className='main__lot-info-wrapper'>
                <div className={classes.titleClasses}>
                    {lot.name}
                    {lot.isSold && <div className={lotClasses.soldLotClasses}>Lot is sold!</div>}
                    {!lot.isSold && !lot.isActive && <div className={lotClasses.notActiveClasses}>Lot is not active!</div>}
                </div>
                <img className='main__image' src={lot.imagePath} alt="lot"/>
                <div className={classes.lotInfoClasses}>
                    <div className='lot-info__item'><span className="lot-info__name">Description: </span><span>{lot.description}</span></div>
                    <div className='lot-info__item'><span className="lot-info__name">Price: </span><span>{lot.priceUsd || lot.minPriceUsd} USD</span></div>
                    <Timer lot={lot}/>
                    <IncreaseRateButtons id={id}/>
                </div>
            </div>
        </div>
    )
}
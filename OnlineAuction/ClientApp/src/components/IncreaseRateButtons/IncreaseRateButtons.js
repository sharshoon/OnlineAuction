import React, {useCallback, useEffect} from "react";
import {increasePriceMethod, priceUpdateCommand} from "../Lot/LotConstants";
import {useDispatch, useSelector} from "react-redux";
import {updateLot} from "../../redux/actions";

export default function IncreaseRateButtons({id, hubConnection}){
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));

    useEffect(() => {
        if(hubConnection){
            hubConnection.on(priceUpdateCommand, function(info){
                if(info.successed){
                    dispatch(updateLot({...lot, priceUsd: info.priceUsd}));
                }
            })
        }
    }, hubConnection)

    const updatePrice = useCallback((percentage) => {
        console.log(percentage, hubConnection);
        if(hubConnection){
            hubConnection.invoke(increasePriceMethod, lot.priceUsd, percentage);
        }
    }, [hubConnection])

    console.log(hubConnection);
    return (
        <div className='lot-info__buttons'>
            <button className='lot-info__button' disabled={hubConnection} onClick={() => updatePrice(5)}>+5%</button>
            <button className='lot-info__button' disabled={hubConnection} onClick={() => updatePrice(10)}>+10%</button>
            <button className='lot-info__button' disabled={hubConnection} onClick={() => updatePrice(20)}>+20%</button>
        </div>
    )
}
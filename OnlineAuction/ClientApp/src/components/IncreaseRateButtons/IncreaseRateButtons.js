import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {
    increasePriceHubPath,
    increasePriceMethod,
    lotHubPath,
    priceUpdateCommand,
    startLotMethod
} from "../Lot/LotConstants";
import {useDispatch, useSelector} from "react-redux";
import {updateLot, updateLotPrice} from "../../redux/actions";
import * as signalR from "@microsoft/signalr";
import classNames from "classnames"

export default function IncreaseRateButtons({id}){
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));
    const hubConnection = useRef(null);

    useEffect(() => {
        hubConnection.current = new signalR.HubConnectionBuilder()
            .withUrl(increasePriceHubPath)
            .build();

        hubConnection.current.start().then(() => {
            hubConnection.current.on(priceUpdateCommand, function(info){
                const json = JSON.parse(info);
                if(json.lotId === lot.id && json.successed) {
                    dispatch(updateLotPrice(json.lotId,json.priceUsd));
                }
            });
        })
        .catch(function (e) {
            alert(e.message);
        });
    }, [])

    const updatePrice = useCallback((percentage) => {
        if(hubConnection){
            const price = parseInt(lot.priceUsd) || parseInt(lot.minPriceUsd);
            hubConnection.current.invoke(increasePriceMethod, lot.id, parseInt(lot.priceUsd) || parseInt(lot.minPriceUsd), percentage);
        }
    }, [hubConnection]);

    const buttonClasses = useMemo(() => {
        return classNames("button", "lot-info__button")
    }, [])

    return (
        <div className='lot-info__buttons'>
            <button className={buttonClasses} disabled={!hubConnection} onClick={() => updatePrice(5)}>+5%</button>
            <button className={buttonClasses} disabled={!hubConnection} onClick={() => updatePrice(10)}>+10%</button>
            <button className={buttonClasses} disabled={!hubConnection} onClick={() => updatePrice(20)}>+20%</button>
        </div>
    )
}
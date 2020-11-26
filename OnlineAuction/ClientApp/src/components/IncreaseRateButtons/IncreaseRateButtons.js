import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {
    increasePriceHubPath,
    increasePriceMethod,
    priceUpdateCommand,
} from "../LotConstants";
import {useDispatch, useSelector} from "react-redux";
import {updateLotPrice} from "../../redux/actions";
import * as signalR from "@microsoft/signalr";
import classNames from "classnames"
import authService from "../api-authorization/AuthorizeService";

export default function IncreaseRateButtons({id}){
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));
    const hubConnection = useRef(null);

    const setConnection = useCallback(async (lot) => {
        const token = await authService.getAccessToken();
        hubConnection.current = new signalR.HubConnectionBuilder()
            .withUrl(increasePriceHubPath, { accessTokenFactory: () => token})
            .build();

        try{
            await hubConnection.current.start()
            hubConnection.current.on(priceUpdateCommand, function(info){
                const json = JSON.parse(info);
                if(json.lotId === lot.id && json.successed) {
                    dispatch(updateLotPrice(json.lotId,json.priceUsd));
                }
            });
        }
        catch(e){
            alert(e.message);
        }
    }, [dispatch])

    useEffect(() => {
        setConnection(lot);
    }, [setConnection])

    const updatePrice = useCallback((percentage, lot) => {
        if(hubConnection){
            hubConnection.current.invoke(increasePriceMethod, lot.id, parseInt(lot.priceUsd) || parseInt(lot.minPriceUsd), percentage);
        }
    }, [hubConnection]);

    const buttonClasses = useMemo(() => {
        return classNames("button", "lot-info__button")
    }, [])

    return (
        <div className='lot-info__buttons'>
            <button className={buttonClasses} disabled={!lot.isActive} onClick={() => updatePrice(5, lot)}>+5%</button>
            <button className={buttonClasses} disabled={!lot.isActive} onClick={() => updatePrice(10, lot)}>+10%</button>
            <button className={buttonClasses} disabled={!lot.isActive} onClick={() => updatePrice(20, lot)}>+20%</button>
        </div>
    )
}
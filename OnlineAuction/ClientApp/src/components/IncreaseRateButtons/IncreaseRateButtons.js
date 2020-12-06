import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
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
import {UserRoles} from "../api-authorization/ApiAuthorizationConstants";

export default function IncreaseRateButtons({id}){
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));
    const hubConnection = useRef(null);
    const [isUser, setUser] = useState(false);

    const setConnection = useCallback(async (lot) => {
        try{
            const token = await authService.getAccessToken();
            if(token !== null) {
                hubConnection.current = new signalR.HubConnectionBuilder()
                    .withUrl(increasePriceHubPath, {accessTokenFactory: () => token})
                    .build();

                hubConnection.current.on(priceUpdateCommand, function (info) {
                    const json = JSON.parse(info);
                    if (json.lotId === lot.id && json.successed) {
                        dispatch(updateLotPrice(json.lotId, json.priceUsd));
                    }
                });
                await hubConnection.current.start();
                const isUser = await authService.hasRole(UserRoles.User);
                setUser(isUser);
            }
        }
        catch{
            alert("error");
        }
    }, [dispatch])

    useEffect(() => {
        setConnection(lot);
    }, [setConnection])

    const updatePrice = useCallback((percentage, lot) => {
        if(hubConnection.current){
            hubConnection.current.invoke(increasePriceMethod, lot.id, parseInt(lot.priceUsd) || parseInt(lot.minPriceUsd), percentage);
        }
    }, []);

    const buttonClasses = useMemo(() => {
        return classNames("button", "lot-info__button")
    }, []);

    const getNewPrice = useCallback((price, percentage) => {
        return Math.trunc(price + price * percentage / 100);
    }, [])

    return (
        <div>
            {
                !isUser && <p className="lot-info__error">You cannot place bets as you are not a user</p>
            }
            <div className='lot-info__buttons'>
                <button className={buttonClasses} disabled={!lot.isActive || !isUser} onClick={() => updatePrice(5, lot)}>+5% [{getNewPrice(lot.priceUsd || lot.minPriceUsd,5)}]</button>
                <button className={buttonClasses} disabled={!lot.isActive || !isUser} onClick={() => updatePrice(10, lot)}>+10% [{getNewPrice(lot.priceUsd || lot.minPriceUsd,10)}]</button>
                <button className={buttonClasses} disabled={!lot.isActive || !isUser} onClick={() => updatePrice(20, lot)}>+20% [{getNewPrice(lot.priceUsd || lot.minPriceUsd,20)}]</button>
            </div>
        </div>
    )
}
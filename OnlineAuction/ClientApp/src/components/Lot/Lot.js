import React, {useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {fetchLot, updateLot} from "../../redux/actions";
import classNames from 'classnames'
import Timer from "../Timer/Timer";
import * as signalR from '@microsoft/signalr';
import IncreaseRateButtons from "../IncreaseRateButtons/IncreaseRateButtons";
import {activateLotCommand, activateLotMessage, decreaseTimeCommand, lotHubPath, startLotMethod} from "./LotConstants";

const titleClasses = classNames("main__title","title");
const lotInfoClasses = classNames("main__lot-info", "lot-info");

const openHubConnection = function(dispatch, lot){
    const hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(lotHubPath)
        .build();

    hubConnection.start().then(() => {
        hubConnection.invoke(startLotMethod, "active", 1);
    }).catch(function (e) {
        alert(e.message);
    })

    hubConnection.on(activateLotCommand, function (message, id) {
        if(lot.id === parseInt(id)){
            dispatch(updateLot({...lot, isActive: message === activateLotMessage}));
        }
    });

    return hubConnection;
}

export default function Lot(props){
    const id = props.match.params.id;
    const dispatch = useDispatch();
    const lot = useSelector(state => state.lotsInfo.lots.find(lot => lot.id === parseInt(id)));
    const [remainSeconds, setSeconds] = useState(0);
    let isEmptyLot = !lot;
    let hubConnection;

    useEffect(() => {
        if(!lot){
            dispatch(fetchLot(id));
        }
    }, []);

    useEffect(() => {
        if(lot) {
            hubConnection = openHubConnection(dispatch, lot);

            hubConnection.on(decreaseTimeCommand, function (seconds) {
                if(!lot.isActive){
                    dispatch(updateLot({...lot, isActive: true}));
                }
                setSeconds(seconds);
            });
        }
    }, [isEmptyLot]);

    if(!lot){
        return "Post loading";
    }

    console.log("lot", hubConnection);
    return (
        <div className='main container__border'>
            <img className='main__image' src={lot.imagePath}/>
            <div className='main__lot-info-wrapper'>
                <div className={titleClasses}>{lot.name}</div>
                <div className={lotInfoClasses}>
                    <div className='lot-info__item'><span className="lot-info__name">Description: </span><span>{lot.description}</span></div>
                    <div className='lot-info__item'><span className="lot-info__name">Price: </span><span>{lot.priceUsd || lot.minPriceUsd} USD</span></div>
                    <Timer lot={lot} seconds={remainSeconds}/>
                    <IncreaseRateButtons id={id} hubConnection={hubConnection} />
                </div>
            </div>
        </div>
    )
}
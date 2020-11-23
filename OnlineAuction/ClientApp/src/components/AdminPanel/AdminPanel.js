import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {fetchLots, updateLot} from "../../redux/actions";
import LoadingPage from "../LoadingPage/LoadingPage";
import AdminLotPreview from "../AdminLotPreview/AdminLotPreview";
import {activateLotCommand, activateLotMessage, lotHubPath} from "../LotConstants";
import * as signalR from "@microsoft/signalr";
import ResultTextBlock from "../ResultTextBlock/ResultTextBlock";

export default function AdminPanel(){
    const dispatch = useDispatch();
    const [operationResult, setResult] = useState({
        message: "",
        successed: true
    });
    const lots = useSelector(state => state.lotsInfo.lots);
    const lotsWrapperClasses = classNames("main", "main__admin-lot-preview-wrapper", "container-border");
    useEffect(() => {
        dispatch(fetchLots());
    },[]);
    const [hubConnection, setConnection] = useState(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(lotHubPath)
            .build();

        connection.start().then(() => {
            setConnection(connection);
        }).catch(function (e) {
            alert(e.message);
        });
    }, [])

    if(!lots.length){
        return <LoadingPage/>
    }
    return (
        <div className={lotsWrapperClasses}>
            <ResultTextBlock successed={operationResult.successed} message={operationResult.message}/>
            {lots.map(lot => <AdminLotPreview lot={lot} key={lot.id} connection={hubConnection} setOperationResult={setResult}/>)}
        </div>
    )
}
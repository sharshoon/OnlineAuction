import React, {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import classNames from "classnames";
import {fetchLots} from "../../redux/actions";
import LoadingPage from "../LoadingPage/LoadingPage";
import AdminLotPreview from "../AdminLotPreview/AdminLotPreview";
import {lotHubPath} from "../LotConstants";
import * as signalR from "@microsoft/signalr";
import ResultTextBlock from "../ResultTextBlock/ResultTextBlock";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";
import Pagination from "../Pagination/Pagination";
import {Redirect} from "react-router";
import {getMultiSelect, getSelectedValues} from "./selectedValues";
import {soldLot, unsoldLot} from "./lotTypes";

export default function AdminPanel({page}){
    const dispatch = useDispatch();
    const lotsInfo = useSelector(state => state.lotsInfo);
    const loading = useSelector(state => state.app.lotLoading);
    const [operationResult, setResult] = useState({
        message: "",
        successed: true
    });
    const [selectedLotTypes, setSelectedLotTypes] = useState({
        options: [{name: "Show sold lots", id : soldLot}, {name: "Show unsold lots", id : unsoldLot}],
        selectedValues : []
    });
    const resetPages = useRef(false);
    const lotsWrapperClasses = classNames("main", "main__admin-lot-preview-wrapper", "container-border");

    useEffect(() => {
        const selectedValues = getSelectedValues(lotsInfo.showSold, lotsInfo.showUnsold);
        setSelectedLotTypes({...selectedLotTypes, selectedValues});
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchLots(page, lotsInfo.showSold, lotsInfo.showUnsold));
    },[dispatch, page]);

    const [hubConnection, setConnection] = useState(null);

    useEffect(() => {
        const connection = new signalR.HubConnectionBuilder()
            .withUrl(lotHubPath)
            .build();

        connection.start().then(() => {
            setConnection(connection);
        });
    }, [])

    const multiselect =  getMultiSelect(selectedLotTypes, resetPages, page, dispatch, setSelectedLotTypes);

    if(loading){
        return <LoadingPage/>
    }
    if(!lotsInfo.lots){
        return <CustomMessagePage message={"Error"}/>
    }
    if(!lotsInfo.lots.length){
        if(page !== 1){
            return <Redirect to={`/lots?${page - 1}`}/>
        }
        return <CustomMessagePage message={"There are no lots on the server"}/>
    }
    return (
        <div className={lotsWrapperClasses}>
            {multiselect}
            <ResultTextBlock successed={operationResult.successed} message={operationResult.message}/>
            {lotsInfo.lots.map(lot => <AdminLotPreview lot={lot} key={lot.id} connection={hubConnection} setOperationResult={setResult} page={page}/>)}
            <div className="main__pagination">
                <Pagination pageCount={lotsInfo.totalPages}/>
            </div>
        </div>
    )
}
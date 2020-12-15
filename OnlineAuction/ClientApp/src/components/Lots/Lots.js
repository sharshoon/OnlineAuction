import React, {useCallback, useEffect, useRef, useState} from 'react'
import LotPreview from "../LotPreview/LotPreview";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../../redux/actions";
import classNames from "classnames"
import LoadingPage from "../LoadingPage/LoadingPage";
import Pagination from "../Pagination/Pagination";
import { Multiselect } from 'multiselect-react-dropdown';
import {multiselectStyles} from "./multiselectStyles";
import {soldLot, unsoldLot} from "./lotTypes";
import {Redirect} from "react-router";

export default function Lots({page}){
    const dispatch = useDispatch();
    const lotsInfo = useSelector(state => state.lotsInfo);
    const loading = useSelector(state => state.app.lotLoading);
    const [selectedLotTypes, setSelectedLotTypes] = useState({
        options: [{name: "Show sold lots", id : soldLot}, {name: "Show unsold lots", id : unsoldLot}],
        selectedValues : []
    });
    const resetPages = useRef(false);
    const lotsWrapperClasses = classNames("main", "main__lot-preview-wrapper", "container-border");

    useEffect(() => {
        const selectedValues = [];
        if(lotsInfo.showSold){
            selectedValues.push({name: "Show sold lots", id : soldLot});
        }
        if(lotsInfo.showUnsold){
            selectedValues.push({name: "Show unsold lots", id : unsoldLot});
        }

        setSelectedLotTypes({...selectedLotTypes, selectedValues});
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchLots(page, lotsInfo.showSold, lotsInfo.showUnsold));
    }, [dispatch, page])

    const onSelect = useCallback((selectedValues) => {
        resetPages.current = true;
        const showSold = selectedValues.some(item => item.id === soldLot);
        const showUnsold = selectedValues.some(item => item.id === unsoldLot);
        dispatch(fetchLots(page, showSold, showUnsold));
        setSelectedLotTypes({...selectedLotTypes, selectedValues});
    }, [])

    const multiselect =  (<Multiselect
        options={selectedLotTypes.options}
        selectedValues={selectedLotTypes.selectedValues}
        onSelect={onSelect}
        onRemove={onSelect}
        displayValue="name"
        style={multiselectStyles}
    />);

    if(loading){
        return <LoadingPage/>
    }
    if(resetPages.current){
        resetPages.current = false;
        return <Redirect to={"/lots"}/>
    }
    if(!lotsInfo.lots){
        return (
            <div className={lotsWrapperClasses}>
                <div className="main__custom-message-page">Error</div>
            </div>
        )
    }
    if(lotsInfo.lots && !lotsInfo.lots.length){
        return (
            <div className={lotsWrapperClasses}>
                {multiselect}
                <div className="main__custom-message-page">There are no lots on the server that meet the filtering conditions</div>
            </div>)
    }
    return (
        <div className={lotsWrapperClasses}>
            {multiselect}
            {lotsInfo.lots.map(lot => <LotPreview lot={lot} key={lot.id}/>)}
            <div className="main__pagination">
                <Pagination pageCount={lotsInfo.totalPages}/>
            </div>
        </div>
    )
}
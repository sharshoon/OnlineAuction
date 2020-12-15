import {soldLot, unsoldLot} from "./lotTypes";
import {fetchLots} from "../../redux/actions";
import {Multiselect} from "multiselect-react-dropdown";
import {multiselectStyles} from "./multiselectStyles";
import React from "react";

export function getSelectedValues(showSold, showUnsold){
    const selectedValues = [];
    if(showSold){
        selectedValues.push({name: "Show sold lots", id : soldLot});
    }
    if(showUnsold){
        selectedValues.push({name: "Show unsold lots", id : unsoldLot});
    }
    return selectedValues;
}

export function onSelect(resetPages, selectedValues, page, dispatch, selectedLotTypes, setSelectedLotTypes){
    resetPages.current = true;
    const showSold = selectedValues.some(item => item.id === soldLot);
    const showUnsold = selectedValues.some(item => item.id === unsoldLot);
    dispatch(fetchLots(page, showSold, showUnsold));
    setSelectedLotTypes({...selectedLotTypes, selectedValues});
}

export function getMultiSelect(selectedLotTypes, resetPages, page, dispatch, setSelectedLotTypes){
    return (<Multiselect
        options={selectedLotTypes.options}
        selectedValues={selectedLotTypes.selectedValues}
        onSelect={(selectedValues) => onSelect(resetPages, selectedValues, page, dispatch, selectedLotTypes, setSelectedLotTypes)}
        onRemove={(selectedValues) => onSelect(resetPages, selectedValues, page, dispatch, selectedLotTypes, setSelectedLotTypes)}
        displayValue="name"
        style={multiselectStyles}
    />);
}
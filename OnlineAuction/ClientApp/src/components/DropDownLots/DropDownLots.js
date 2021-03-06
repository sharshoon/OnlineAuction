import React, {useEffect, useMemo, useState} from "react"
import {fetchDropDownLots} from "./fetchDropDrownLots";
import classNames from "classnames";
import DropDownPagination from "../DropDownPagination/DropDownPagination";
import {startAfter} from "../AdminLotPreview/startAfter";

export default function DropDownLots({currentLot, setOperationResult}){
    const [dropDown, setDropDown] = useState({
        isOpen : false,
        page : 1,
        pageCount : 0,
        selected : null,
        lots : [],
    });
    const classes = useMemo(() => {
        return {
            buttonNextLotClasses : classNames("button", "admin-lot-preview__button", "admin-lot-preview__major-button", "dropDownLots__button", "container-border"),
            dropDownContentClasses : classNames("dropDownLots__content", "container-border"),
            buttonWrapperClasses : classNames("admin-lot-preview__major-button", "dropDownLots__button-wrapper"),
            buttonClasses : classNames("button", "admin-lot-preview__button", "dropDownLots__set-button")
        }
    }, [])

    useEffect(() => {
        fetchDropDownLots(setDropDown, dropDown.page, true, true).then((json) => {
            if(json){
                setDropDown({
                    lots : json.lots,
                    page : dropDown.page,
                    pageCount : json.pagesCount,
                    isOpen : dropDown.isOpen
                })
            }
        })
    }, [])

    const dropDownContent = dropDown && dropDown.lots ?
        dropDown.lots.map(lot => lot.id !== currentLot.id && !lot.isSold && !lot.isActive &&
            <button
                key={lot.id}
                onClick={() => setDropDown({...dropDown, selected: lot, isOpen: false})}
                className="dropDownLots__item">{lot.name} [ID: {lot.id}]
            </button>) :
        <div className="dropDownLots__item">No lots!</div>;

    const dropDownTitle = dropDown && dropDown.selected ? `${dropDown.selected.name} [ID: ${dropDown.selected.id}]` : "Start After...";

    return(
        <div className="main__dropDownLots">
            <div className={classes.buttonWrapperClasses}>
                <button
                    className={classes.buttonNextLotClasses}
                    onClick={() => setDropDown({...dropDown, isOpen: !dropDown.isOpen})}
                >
                    {dropDownTitle}
                </button>
                {dropDown.isOpen &&
                    <div className={classes.dropDownContentClasses}>
                        {dropDownContent}
                        <DropDownPagination page={dropDown.page} pageCount={dropDown.pageCount} setDropDown={setDropDown}/>
                    </div>
                }
            </div>
            <button
                className={classes.buttonClasses}
                onClick={() => startAfter(currentLot, dropDown.selected, setOperationResult, dropDown, setDropDown)}
            >
                Set
            </button>
        </div>
    )
}
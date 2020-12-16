import React from "react"
import {fetchDropDownLots} from "../DropDownLots/fetchDropDrownLots";

export default function DropDownPagination({page, pageCount, setDropDown}){
    return (
        <div className="main__dropDownPagination">
            <div className="pagination">
                {
                    page !== 1 && <button
                        className="pagination__link"
                        onClick={() => fetchDropDownLots(setDropDown, page - 1, true, true, true)}
                    >
                        «
                    </button>
                }
                {
                    page !== pageCount && <button
                        className="pagination__link"
                        onClick={() => fetchDropDownLots(setDropDown, page + 1, true, true, true)}
                    >
                        »
                    </button>
                }
            </div>
        </div>
    )
}
import React from "react"
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../../redux/actions";
import classNames from "classnames"

export default function Pagination({pageCount}){
    const items = [];
    const dispatch = useDispatch();
    const lotsInfo = useSelector(state => state.lotsInfo);
    for(let i = 1; i <= pageCount; i++){
        items.push(<button
            className={classNames("pagination__link", {"pagination__link--active" : lotsInfo.activePage === i})}
            onClick={() => dispatch(fetchLots(i))}
            key={i}
            >
                {i}
            </button>
        );
    }
    return (
        <div className="pagination">
            {
                lotsInfo.activePage !== 1 && <button
                className="pagination__link"
                onClick={() => dispatch(fetchLots(lotsInfo.activePage - 1))}
                >
                    «
                </button>
            }
            {items}
            {
                lotsInfo.activePage !== lotsInfo.totalPages && <button
                    className="pagination__link"
                    onClick={() => dispatch(fetchLots(lotsInfo.activePage + 1))}
                >
                    »
                </button>
            }
        </div>
    )
}
import React from "react"
import {useSelector} from "react-redux";
import classNames from "classnames"
import {NavLink} from "react-router-dom";
import {Link} from "react-router-dom";

export default function Pagination({pageCount}){
    const items = [];
    const lotsInfo = useSelector(state => state.lotsInfo);
    for(let i = 1; i <= pageCount; i++){
        if(Math.abs(i - lotsInfo.activePage <=5)){
            items.push(<NavLink
                    className={classNames("pagination__link", {"pagination__link--active" : lotsInfo.activePage === i})}
                    to={`/lots?page=${i}`}
                    key={i}
                >
                    {i}
                </NavLink>
            );
        }
    }
    return (
        <div className="pagination">
            {
                lotsInfo.activePage !== 1 && <NavLink
                    className="pagination__link"
                    to={`/lots?page=${lotsInfo.activePage - 1}`}
                    tag={Link}
                >
                    «
                </NavLink>
            }
            {items}
            {
                lotsInfo.activePage !== lotsInfo.totalPages && <NavLink
                    className="pagination__link"
                    to={`/lots?page=${lotsInfo.activePage + 1}`}
                    tag={Link}
                >
                    »
                </NavLink>
            }
        </div>
    )
}
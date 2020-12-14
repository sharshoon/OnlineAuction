import React from "react"
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../../redux/actions";

export default function Switcher({page}){
    const dispatch = useDispatch();
    const onlyUnsold = useSelector(state => state.lotsInfo.onlyUnsold);
    return (
        <div className="main__switcher-wrapper">
            <div className="switcher">
                <input type="checkbox" checked={!onlyUnsold} onChange={() => dispatch(fetchLots(page, !onlyUnsold))} className="switcher__checkbox"/>
                <div className="switcher__knobs"/>
                <div className="switcher__layer"/>
            </div>
        </div>
    )
}
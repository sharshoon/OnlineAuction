import React, {useEffect} from 'react'
import LotPreview from "../LotPreview/LotPreview";
import {useDispatch, useSelector} from "react-redux";
import {fetchLots} from "../../redux/actions";
import classNames from "classnames"
import LoadingPage from "../LoadingPage/LoadingPage";
import CustomMessagePage from "../CustomMessagePage/CustomMessagePage";
import Pagination from "../Pagination/Pagination";

export default function Lots(){
    const dispatch = useDispatch();
    const lotsInfo = useSelector(state => state.lotsInfo);
    const loading = useSelector(state => state.app.lotLoading);
    const lotsWrapperClasses = classNames("main", "main__lot-preview-wrapper", "container-border");
    useEffect(() => {
        dispatch(fetchLots(1));
    },[dispatch])

    if(loading){
        return <LoadingPage/>
    }
    if(!lotsInfo.lots.length){
        return <CustomMessagePage message={"There are no lots on the server"}/>
    }
    return (
        <div className={lotsWrapperClasses}>
            {lotsInfo.lots.map(lot => <LotPreview lot={lot} key={lot.id}/>)}
            <div className="main__pagination">
                <Pagination pageCount={lotsInfo.totalPages}/>
            </div>
        </div>
    )
}
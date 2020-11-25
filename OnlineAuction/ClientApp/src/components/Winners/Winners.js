import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {lotControllerPath, winnersControllerPath} from "../LotConstants";
import LoadingPage from "../LoadingPage/LoadingPage";
import classNames from "classnames";

export default function Winners(){
    const [winners, setWinners] = useState([]);
    const dispatch = useDispatch();
    const loading = useSelector(state => state.app.winnersLoading);

    const getWinners = useCallback(async () => {
        const response = await fetch(winnersControllerPath);
        const json = await response.json();
        setWinners(json);
    }, [])

    useEffect(() => {
        getWinners();
    }, [])

    const classes = useMemo(() => {
        return {
            mainClasses : classNames("main", "container-border", "main__winners"),
            tableClasses : classNames("table")
        }
    }, [])

    if(loading){
        return <LoadingPage/>
    }
    if(!winners.length){
        return "No information about the lot winners!"
    }

    console.log(winners);

    return (
        <div className={classes.mainClasses}>
            <table className={classes.tableClasses}>
                <thead className="table__header">
                    <tr>
                        <th className="table__header-item">Lot ID</th>
                        <th className="table__header-item">Lot Name</th>
                        <th className="table__header-item">Winner ID</th>
                        <th className="table__header-item">Winner Name</th>
                        <th className="table__header-item">Sold Price</th>
                    </tr>
                </thead>
                <tbody className="table__body">
                {winners.map(winner => {
                    return (
                        <tr key={winner.id}>
                            <th className="table__item">{winner.id}</th>
                            <th className="table__item">{winner.lotName}</th>
                            <th className="table__item">{winner.userId}</th>
                            <th className="table__item">{winner.ownerName}</th>
                            <th className="table__item">{winner.priceUSd}</th>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
    )
}